// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MorphPass is ERC721 {
    address public owner;
    uint256 public totalInstances;
    uint256 public totalSupply;

    struct Instance {
        string name;
        uint256 id;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string time;
        string date;
        string location;
    }

    mapping(uint256 => Instance) instances;  
    mapping(uint256 => mapping(address => bool)) public hasTicket;
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;
    mapping(uint256 => uint256[]) seatsTaken;



    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function list(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _time,
        string memory _date,
        string memory _location 
    ) public onlyOwner {

        totalInstances++;

        instances[totalInstances] = Instance(
            _name,
            totalInstances,
            _cost,
            100, // Initial tickets sold
            _maxTickets,
            _time,
            _date,
            _location
        );
    }

    function mint(uint256 _id, uint256 _seat) public payable {

        instances[_id].tickets -= 1;

        hasTicket[_id][msg.sender] = true;

        seatTaken[_id][_seat] = msg.sender;

        seatsTaken[_id].push(_seat);

        totalSupply++;
        _safeMint(msg.sender, totalSupply);
    }

    function getInstance(uint256 _id) public view returns (Instance memory) {
        return instances[_id];
    }

}