// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title NationalBudgetTracker
 * @dev Transparent on-chain budget allocation and tracking system
 * Inspired by Bam Aquino's transparency principles for public fund management
 */
contract NationalBudgetTracker is Ownable, ReentrancyGuard {
    enum BudgetCategory {
        Healthcare,
        Education,
        Infrastructure,
        PublicWorks,
        Defense,
        Agriculture,
        SocialWelfare,
        Environment,
        Tourism,
        Other
    }

    enum AllocationStatus {
        Proposed,
        Approved,
        Disbursed,
        Completed,
        Disputed
    }

    struct BudgetAllocation {
        uint256 allocationId;
        BudgetCategory category;
        string projectName;
        string description;
        address projectLead;
        uint256 allocatedAmount;
        uint256 disbursedAmount;
        uint256 spentAmount;
        AllocationStatus status;
        uint256 createdAt;
        uint256 approvedAt;
        uint256 targetCompletionDate;
        string documentHash; // IPFS hash for project documents
        bool isActive;
    }

    struct Milestone {
        uint256 milestoneId;
        uint256 allocationId;
        string description;
        uint256 targetAmount;
        uint256 percentageCompletion;
        uint256 targetDate;
        bool completed;
    }

    struct Expense {
        uint256 expenseId;
        uint256 allocationId;
        address vendor;
        uint256 amount;
        string description;
        uint256 timestamp;
        string receiptHash;
        bool verified;
    }

    struct Audit {
        uint256 auditId;
        uint256 allocationId;
        address auditor;
        string findings;
        bool isCompliant;
        uint256 timestamp;
    }

    // Storage
    uint256 public totalBudget;
    uint256 public allocatedBudget;
    uint256 public disbursedBudget;
    uint256 public spentBudget;

    uint256 private nextAllocationId = 1;
    uint256 private nextExpenseId = 1;
    uint256 private nextAuditId = 1;

    mapping(uint256 => BudgetAllocation) public allocations;
    mapping(uint256 => Milestone[]) public allocationMilestones;
    mapping(uint256 => Expense[]) public allocationExpenses;
    mapping(uint256 => Audit[]) public allocationAudits;

    mapping(address => uint256[]) public projectLeadAllocations;
    mapping(BudgetCategory => uint256) public categoryTotals;

    address[] public approvers;
    mapping(address => bool) public isApprover;

    // Events
    event BudgetSet(uint256 totalBudget);
    event AllocationCreated(uint256 indexed allocationId, BudgetCategory category, uint256 amount);
    event AllocationApproved(uint256 indexed allocationId, address approver);
    event AllocationDisbursed(uint256 indexed allocationId, uint256 amount);
    event ExpenseRecorded(uint256 indexed allocationId, uint256 expenseId, uint256 amount);
    event MilestoneCompleted(uint256 indexed allocationId, uint256 milestoneId);
    event AuditRecorded(uint256 indexed allocationId, uint256 auditId, bool isCompliant);
    event ApproverAdded(address approver);

    modifier onlyApprover() {
        require(isApprover[msg.sender] || msg.sender == owner(), "Not an approver");
        _;
    }

    modifier validAllocation(uint256 _allocationId) {
        require(_allocationId > 0 && _allocationId < nextAllocationId, "Invalid allocation");
        _;
    }

    constructor(uint256 _initialBudget) Ownable(msg.sender) {
        totalBudget = _initialBudget;
        isApprover[msg.sender] = true;
        approvers.push(msg.sender);
    }

    // Budget Management
    function setBudget(uint256 _amount) external onlyOwner {
        totalBudget = _amount;
        emit BudgetSet(_amount);
    }

    function addApprover(address _approver) external onlyOwner {
        require(_approver != address(0), "Invalid address");
        if (!isApprover[_approver]) {
            isApprover[_approver] = true;
            approvers.push(_approver);
            emit ApproverAdded(_approver);
        }
    }

    // Allocation Management
    function createAllocation(
        BudgetCategory _category,
        string memory _projectName,
        string memory _description,
        address _projectLead,
        uint256 _amount,
        uint256 _targetCompletionDate,
        string memory _documentHash
    ) external onlyOwner returns (uint256) {
        require(_amount > 0, "Amount must be positive");
        require(allocatedBudget + _amount <= totalBudget, "Exceeds budget");
        require(_projectLead != address(0), "Invalid project lead");

        uint256 allocationId = nextAllocationId++;

        allocations[allocationId] = BudgetAllocation({
            allocationId: allocationId,
            category: _category,
            projectName: _projectName,
            description: _description,
            projectLead: _projectLead,
            allocatedAmount: _amount,
            disbursedAmount: 0,
            spentAmount: 0,
            status: AllocationStatus.Proposed,
            createdAt: block.timestamp,
            approvedAt: 0,
            targetCompletionDate: _targetCompletionDate,
            documentHash: _documentHash,
            isActive: true
        });

        projectLeadAllocations[_projectLead].push(allocationId);
        allocatedBudget += _amount;
        categoryTotals[_category] += _amount;

        emit AllocationCreated(allocationId, _category, _amount);
        return allocationId;
    }

    function approveAllocation(uint256 _allocationId) external onlyApprover validAllocation(_allocationId) {
        BudgetAllocation storage allocation = allocations[_allocationId];
        require(allocation.status == AllocationStatus.Proposed, "Invalid status");

        allocation.status = AllocationStatus.Approved;
        allocation.approvedAt = block.timestamp;

        emit AllocationApproved(_allocationId, msg.sender);
    }

    function disburseAllocation(uint256 _allocationId, uint256 _amount) 
        external 
        onlyOwner 
        validAllocation(_allocationId) 
        nonReentrant 
    {
        BudgetAllocation storage allocation = allocations[_allocationId];

        require(allocation.status == AllocationStatus.Approved, "Not approved");
        require(_amount > 0, "Invalid amount");
        require(allocation.disbursedAmount + _amount <= allocation.allocatedAmount, "Exceeds allocation");

        allocation.disbursedAmount += _amount;
        allocation.status = AllocationStatus.Disbursed;
        disbursedBudget += _amount;

        (bool success, ) = payable(allocation.projectLead).call{ value: _amount }("");
        require(success, "Transfer failed");

        emit AllocationDisbursed(_allocationId, _amount);
    }

    // Expense Tracking
    function recordExpense(
        uint256 _allocationId,
        address _vendor,
        uint256 _amount,
        string memory _description,
        string memory _receiptHash
    ) external onlyOwner validAllocation(_allocationId) returns (uint256) {
        BudgetAllocation storage allocation = allocations[_allocationId];

        require(allocation.isActive, "Allocation not active");
        require(_amount > 0, "Invalid amount");
        require(allocation.spentAmount + _amount <= allocation.disbursedAmount, "Exceeds disbursed amount");

        uint256 expenseId = nextExpenseId++;

        Expense memory expense = Expense({
            expenseId: expenseId,
            allocationId: _allocationId,
            vendor: _vendor,
            amount: _amount,
            description: _description,
            timestamp: block.timestamp,
            receiptHash: _receiptHash,
            verified: false
        });

        allocationExpenses[_allocationId].push(expense);
        allocation.spentAmount += _amount;
        spentBudget += _amount;

        emit ExpenseRecorded(_allocationId, expenseId, _amount);
        return expenseId;
    }

    // Milestone Tracking
    function addMilestone(
        uint256 _allocationId,
        string memory _description,
        uint256 _targetAmount,
        uint256 _targetDate
    ) external validAllocation(_allocationId) {
        require(msg.sender == allocations[_allocationId].projectLead || msg.sender == owner(), "Not authorized");

        uint256 milestoneId = allocationMilestones[_allocationId].length;

        allocationMilestones[_allocationId].push(Milestone({
            milestoneId: milestoneId,
            allocationId: _allocationId,
            description: _description,
            targetAmount: _targetAmount,
            percentageCompletion: 0,
            targetDate: _targetDate,
            completed: false
        }));
    }

    function completeMilestone(uint256 _allocationId, uint256 _milestoneId) 
        external 
        validAllocation(_allocationId) 
    {
        require(msg.sender == allocations[_allocationId].projectLead || msg.sender == owner(), "Not authorized");
        require(_milestoneId < allocationMilestones[_allocationId].length, "Invalid milestone");

        Milestone storage milestone = allocationMilestones[_allocationId][_milestoneId];
        milestone.completed = true;
        milestone.percentageCompletion = 100;

        emit MilestoneCompleted(_allocationId, _milestoneId);
    }

    // Audit Functions
    function recordAudit(
        uint256 _allocationId,
        string memory _findings,
        bool _isCompliant
    ) external onlyApprover validAllocation(_allocationId) {
        uint256 auditId = nextAuditId++;

        allocationAudits[_allocationId].push(Audit({
            auditId: auditId,
            allocationId: _allocationId,
            auditor: msg.sender,
            findings: _findings,
            isCompliant: _isCompliant,
            timestamp: block.timestamp
        }));

        if (!_isCompliant) {
            allocations[_allocationId].status = AllocationStatus.Disputed;
        }

        emit AuditRecorded(_allocationId, auditId, _isCompliant);
    }

    // Query Functions
    function getAllocation(uint256 _allocationId) 
        external 
        view 
        validAllocation(_allocationId) 
        returns (BudgetAllocation memory) 
    {
        return allocations[_allocationId];
    }

    function getMilestones(uint256 _allocationId) 
        external 
        view 
        validAllocation(_allocationId) 
        returns (Milestone[] memory) 
    {
        return allocationMilestones[_allocationId];
    }

    function getExpenses(uint256 _allocationId) 
        external 
        view 
        validAllocation(_allocationId) 
        returns (Expense[] memory) 
    {
        return allocationExpenses[_allocationId];
    }

    function getAudits(uint256 _allocationId) 
        external 
        view 
        validAllocation(_allocationId) 
        returns (Audit[] memory) 
    {
        return allocationAudits[_allocationId];
    }

    function getBudgetStatus() external view returns (
        uint256 total,
        uint256 allocated,
        uint256 disbursed,
        uint256 spent,
        uint256 available
    ) {
        return (totalBudget, allocatedBudget, disbursedBudget, spentBudget, totalBudget - allocatedBudget);
    }

    function getCategoryTotal(BudgetCategory _category) external view returns (uint256) {
        return categoryTotals[_category];
    }

    function getProjectLeadAllocations(address _projectLead) external view returns (uint256[] memory) {
        return projectLeadAllocations[_projectLead];
    }

    receive() external payable {}
}
