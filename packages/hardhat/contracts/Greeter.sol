//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

/// @title A contract for Gardens
/// @author Carl Barrdahl
/// @notice You can use this contract to plant your garden
/// @dev All function calls are currently implemented without side effects
/// @custom:component GardenComponent
contract Garden {
    string private greeting;

    mapping(bytes32 => Seedling) private _planted;

    /// @notice Planted event is emitted when a seedling is planted
    /// @param planter The address of the planter
    /// @param seed The type of seed
    event Planted(address planter, uint8 seed);

    struct Seedling {
        address planter;
        uint8 seed;
    }

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    /// @notice Plant a new seed in the garden
    /// @dev Creates a Seedling and emits Planted event
    /// @param planter The address of the planter
    /// @param seed The type of seed
    /// @return Seedling with planter and seed type
    function plant(address planter, uint8 seed)
        public
        payable
        returns (Seedling memory)
    {
        bytes32 id = keccak256(abi.encodePacked(planter, seed));
        Seedling memory seedling = (Seedling(planter, seed));
        _planted[id] = seedling;

        emit Planted(planter, seed);
        return seedling;
    }

    /// @notice Planted event is emitted when a seedling is planted
    /// @param id The id of the Seedling
    /// @return Seedling with planter and seed type
    function planted(bytes32 id) public view returns (Seedling memory) {
        return _planted[id];
    }
}
