// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

abstract contract Ownable {
    address private _owner;

    constructor() {
        _owner = msg.sender;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == msg.sender, "Ownership Assertion: Caller of the function is not the owner.");
        _;
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        _owner = newOwner;
    }
}

struct Event {
    string name;
    address organizer;
    address other;
}

contract PrivyCal is Ownable {

    mapping (address => string) private names;
    
    mapping (uint256 => Event) private eventDetails; 

    function getName() public view returns (string memory) {
        return names[msg.sender];
    }

    function setName(string memory name) public {
        names[msg.sender] = name;
    }

    function createEvent(uint256 id, string memory name, address other) public {
        eventDetails[id] = Event(name, msg.sender, other);
    }

    function getEvent(address owner, string memory name) public view returns (Event memory) {
        uint256 id = uint256(keccak256(abi.encodePacked(owner, name)));
        return eventDetails[id];
    }
}
