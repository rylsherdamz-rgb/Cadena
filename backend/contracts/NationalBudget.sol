// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PhilippineNationalBudgetLedger
 * @notice BFT-based transparency & audit ledger for PH national budget
 * @author Academic / Demo
 *
 * This contract records approved budgets, requires multi-authority
 * consensus (Byzantine Fault Tolerance), tracks releases, spending,
 * audits, and allows public verification and flagging.
 */

contract NationalBudget {

    /*//////////////////////////////////////////////////////////////
                              CONSTANTS
    //////////////////////////////////////////////////////////////*/

    uint256 public constant BFT_QUORUM = 3;

    /*//////////////////////////////////////////////////////////////
                               ENUMS
    //////////////////////////////////////////////////////////////*/

    enum AuthorityRole {
        DBM,
        HOUSE,
        SENATE,
        PRESIDENT,
        COA
    }

    /*//////////////////////////////////////////////////////////////
                              STRUCTS
    //////////////////////////////////////////////////////////////*/

    struct Authority {
        bool exists;
        AuthorityRole role;
    }

    struct BudgetProgram {
        string name;
        string agency;
        uint256 approvedAmount;
        uint256 releasedAmount;
        uint256 approvalCount;
        bool finalized;
        bool exists;
    }

    struct SpendingReport {
        uint256 amount;
        string ipfsHash;
        bool verified;
    }

    struct PublicFlag {
        address reporter;
        string reason;
        uint256 timestamp;
    }

    /*//////////////////////////////////////////////////////////////
                              STORAGE
    //////////////////////////////////////////////////////////////*/

    address public superAdmin; // deployer (initial setup only)

    uint256 public programCount;

    mapping(address => Authority) public authorities;
    mapping(uint256 => BudgetProgram) public programs;

    mapping(uint256 => mapping(address => bool)) public approvals;
    mapping(uint256 => SpendingReport[]) public spendingReports;
    mapping(uint256 => PublicFlag[]) public publicFlags;

    /*//////////////////////////////////////////////////////////////
                               EVENTS
    //////////////////////////////////////////////////////////////*/

    event AuthorityAdded(address indexed authority, AuthorityRole role);
    event BudgetProposed(uint256 indexed programId, string name, uint256 amount);
    event BudgetApproved(uint256 indexed programId, address indexed authority);
    event BudgetFinalized(uint256 indexed programId);
    event FundsReleased(uint256 indexed programId, uint256 amount);
    event SpendingReported(uint256 indexed programId, uint256 amount);
    event SpendingVerified(uint256 indexed programId, uint256 reportIndex);
    event PublicFlagSubmitted(uint256 indexed programId, address indexed reporter);

    /*//////////////////////////////////////////////////////////////
                              MODIFIERS
    //////////////////////////////////////////////////////////////*/

    modifier onlySuperAdmin() {
        require(msg.sender == superAdmin, "Only super admin");
        _;
    }

    modifier onlyAuthority() {
        require(authorities[msg.sender].exists, "Not authority");
        _;
    }

    modifier onlyDBM() {
        require(
            authorities[msg.sender].exists &&
            authorities[msg.sender].role == AuthorityRole.DBM,
            "Only DBM"
        );
        _;
    }

    modifier onlyCOA() {
        require(
            authorities[msg.sender].exists &&
            authorities[msg.sender].role == AuthorityRole.COA,
            "Only COA"
        );
        _;
    }

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor() {
        superAdmin = msg.sender;
    }

    /*//////////////////////////////////////////////////////////////
                         AUTHORITY MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    function addAuthority(address _addr, AuthorityRole _role)
        external
        onlySuperAdmin
    {
        require(!authorities[_addr].exists, "Already authority");

        authorities[_addr] = Authority({
            exists: true,
            role: _role
        });

        emit AuthorityAdded(_addr, _role);
    }

    /*//////////////////////////////////////////////////////////////
                         BUDGET PROPOSAL
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice DBM proposes an already-approved GAA item
     * @dev Proposal must still pass BFT approval
     */
    function proposeBudget(
        string calldata _name,
        string calldata _agency,
        uint256 _amount
    ) external onlyDBM {

        require(_amount > 0, "Invalid amount");

        programs[programCount] = BudgetProgram({
            name: _name,
            agency: _agency,
            approvedAmount: _amount,
            releasedAmount: 0,
            approvalCount: 0,
            finalized: false,
            exists: true
        });

        emit BudgetProposed(programCount, _name, _amount);
        programCount++;
    }

    /*//////////////////////////////////////////////////////////////
                         BFT APPROVAL LOGIC
    //////////////////////////////////////////////////////////////*/

    function approveBudget(uint256 _programId)
        external
        onlyAuthority
    {
        BudgetProgram storage program = programs[_programId];
        require(program.exists, "Program not found");
        require(!program.finalized, "Already finalized");
        require(!approvals[_programId][msg.sender], "Already approved");

        approvals[_programId][msg.sender] = true;
        program.approvalCount++;

        emit BudgetApproved(_programId, msg.sender);

        if (program.approvalCount >= BFT_QUORUM) {
            program.finalized = true;
            emit BudgetFinalized(_programId);
        }
    }

    /*//////////////////////////////////////////////////////////////
                        BUDGET EXECUTION (DBM)
    //////////////////////////////////////////////////////////////*/

    function releaseFunds(uint256 _programId, uint256 _amount)
        external
        onlyDBM
    {
        BudgetProgram storage program = programs[_programId];

        require(program.exists, "Program not found");
        require(program.finalized, "Not BFT approved");
        require(
            program.releasedAmount + _amount <= program.approvedAmount,
            "Exceeds approved budget"
        );

        program.releasedAmount += _amount;
        emit FundsReleased(_programId, _amount);
    }

    /*//////////////////////////////////////////////////////////////
                     AGENCY SPENDING + COA AUDIT
    //////////////////////////////////////////////////////////////*/

    function submitSpendingReport(
        uint256 _programId,
        uint256 _amount,
        string calldata _ipfsHash
    ) external {

        BudgetProgram storage program = programs[_programId];
        require(program.exists, "Program not found");
        require(_amount > 0, "Invalid amount");
        require(program.releasedAmount >= _amount, "Insufficient released funds");

        spendingReports[_programId].push(
            SpendingReport({
                amount: _amount,
                ipfsHash: _ipfsHash,
                verified: false
            })
        );

        emit SpendingReported(_programId, _amount);
    }

    function verifySpending(uint256 _programId, uint256 _reportIndex)
        external
        onlyCOA
    {
        SpendingReport storage report =
            spendingReports[_programId][_reportIndex];

        require(!report.verified, "Already verified");

        report.verified = true;
        emit SpendingVerified(_programId, _reportIndex);
    }

    /*//////////////////////////////////////////////////////////////
                         PUBLIC TRANSPARENCY
    //////////////////////////////////////////////////////////////*/

    function submitPublicFlag(uint256 _programId, string calldata _reason)
        external
    {
        require(programs[_programId].exists, "Program not found");

        publicFlags[_programId].push(
            PublicFlag({
                reporter: msg.sender,
                reason: _reason,
                timestamp: block.timestamp
            })
        );

        emit PublicFlagSubmitted(_programId, msg.sender);
    }

    /*//////////////////////////////////////////////////////////////
                           VIEW HELPERS
    //////////////////////////////////////////////////////////////*/

    function getSpendingReportCount(uint256 _programId)
        external
        view
        returns (uint256)
    {
        return spendingReports[_programId].length;
    }

    function getPublicFlagCount(uint256 _programId)
        external
        view
        returns (uint256)
    {
        return publicFlags[_programId].length;
    }
}
