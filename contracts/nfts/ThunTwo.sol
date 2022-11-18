// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ThunTwo is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    uint256 MAX_SUPPLY = 3;

    constructor() ERC721("ThunTwo", "TT") {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmVYPYWQ4VfZj632YVZqxzM6TZ45sXkDxWBjZCRNg8dydT/";
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId < MAX_SUPPLY, "All NFT had been minted");
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        string memory baseURI = _baseURI();
        string memory tokenUri = string(
            abi.encodePacked(baseURI, Strings.toString(tokenId))
        );
        _setTokenURI(tokenId, tokenUri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
