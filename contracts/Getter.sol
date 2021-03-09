//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.1;

import "hardhat/console.sol";

import "./interfaces/IPie.sol";
import "./interfaces/IPieRegistry.sol";
import "./interfaces/ILendingRegistry.sol";
import "./interfaces/ILendingLogic.sol";

contract Getter {

    address[] tokens_; //used as dynamic memory arrays
    uint256[] amounts_; //used as dynamic memory arrays

    IPieRegistry public pieRegistry;
    ILendingRegistry public lendingRegistry;

    constructor(address _pieRegistry, address _lendingRegistry) {
        pieRegistry = IPieRegistry(_pieRegistry);
        lendingRegistry = ILendingRegistry(_lendingRegistry);
    }

    function getAssetsAndAmounts(address _token) external returns(address[] memory tokens, uint256[] memory amounts) {
        return getAssetsAndAmountsForAmount(_token, 1 * 10**18);
    }

    function getStuff(address _token, uint256 _amount) public returns(address[] memory tokens, uint256[] memory amounts) {
        (tokens, amounts) = getAssetsAndAmountsForAmount(_token, _amount);

        console.log(tokens);
        console.log(amounts);
    }

    function getAssetsAndAmountsForAmount(address _token, uint256 _amount) public returns(address[] memory tokens, uint256[] memory amounts) {
        tokens = new address[](100);
        amounts = new uint256[](100);

        IPie pie = IPie(_token);

        address underlying = lendingRegistry.wrappedToUnderlying(_token);

        if(pieRegistry.inRegistry(_token)) {
            return pie.calcTokensForAmount(_amount);
        } else if(underlying != address(0)) {
            tokens = new address[](1);
            amounts = new address[](1);

            tokens[0] = underlying;
            ILendingLogic lendingLogic = getLendingLogicFromWrapped(_token);
            uint256 exchangeRate = lendingLogic.exchangeRate(_token) + 1; // wrapped to underlying
            amounts[0] = _amount * exchangeRate / (10**18) + 1;
        } else {
            tokens = new address[](1);
            amounts = new address[](1);
            tokens[0] = _token;
            amounts[0] = _amount;
        }
    }

    function getLendingLogicFromWrapped(address _wrapped) internal view returns(ILendingLogic) {
        return ILendingLogic(
                lendingRegistry.protocolToLogic(
                    lendingRegistry.wrappedToProtocol(
                        _wrapped
                    )
                )
        );
    }

    
}
