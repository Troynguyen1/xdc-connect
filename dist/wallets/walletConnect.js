"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetChainId = GetChainId;
exports.GetProvider = GetProvider;
exports.IsWalletConnectSupported = IsWalletConnectSupported;
exports.SendTransaction = SendTransaction;
exports._initListerner = _initListerner;
exports.initWalletConnect = initWalletConnect;

var _xdc = _interopRequireDefault(require("xdc3"));

var _detectProvider = _interopRequireDefault(require("@metamask/detect-provider"));

var _lodash = _interopRequireDefault(require("lodash"));

var _crypto = require("../helpers/crypto");

var _constant = require("../helpers/constant");

var actions = _interopRequireWildcard(require("../actions"));

var _store = _interopRequireDefault(require("../redux/store"));

var _reactToastify = require("react-toastify");

var _miscellaneous = require("../helpers/miscellaneous");

var _math = require("../helpers/math");

var _node = _interopRequireDefault(require("@walletconnect/node"));

var _qrcodeModal = _interopRequireDefault(require("@walletconnect/qrcode-modal"));

var _jsxRuntime = require("react/jsx-runtime");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var addresses, connector, addressChangeIntervalRef;

function IsWalletConnectSupported() {
  return Boolean(window.ethereum);
}

function GetProvider() {
  return _GetProvider.apply(this, arguments);
}

function _GetProvider() {
  _GetProvider = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var provider;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _detectProvider.default)();

          case 2:
            provider = _context.sent;
            return _context.abrupt("return", provider);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _GetProvider.apply(this, arguments);
}

function GetChainId() {
  return _GetChainId.apply(this, arguments);
}

function _GetChainId() {
  _GetChainId = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!connector.connected) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return", connector.networkId());

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _GetChainId.apply(this, arguments);
}

function initWalletConnect() {
  return _initWalletConnect.apply(this, arguments);
}

function _initWalletConnect() {
  _initWalletConnect = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            connector = new _node.default({
              bridge: "https://bridge.walletconnect.org" // Required

            }, {
              clientMeta: {
                description: "WalletConnect NodeJS Client",
                url: "https://nodejs.org/en/",
                icons: ["https://nodejs.org/static/images/logo.svg"],
                name: "WalletConnect"
              }
            });

            if (!connector.connected) {
              // create new session
              connector.createSession().then(function () {
                // get uri for QR Code modal
                var uri = connector.uri; // display QR Code modal

                _qrcodeModal.default.open(uri, function () {
                  console.log("QR Code Modal closed");
                });
              });
            }

            _initListerner();

            _context3.next = 14;
            break;

          case 6:
            _context3.prev = 6;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);

            if (!(_context3.t0 === "timeout")) {
              _context3.next = 12;
              break;
            }

            (0, _reactToastify.toast)( /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
              children: "Error while connecting to WalletConnect: Timeout. Please check your WalletConnect or try after refresh."
            }), {
              autoClose: false
            });
            return _context3.abrupt("return", _store.default.dispatch(actions.WalletDisconnected()));

          case 12:
            (0, _reactToastify.toast)( /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
              children: "Error while connecting to WalletConnect provider"
            }), {
              autoClose: false
            });
            return _context3.abrupt("return", _store.default.dispatch(actions.WalletDisconnected()));

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 6]]);
  }));
  return _initWalletConnect.apply(this, arguments);
}

function _initListerner() {
  window.ethereum.removeAllListeners();
  if (addressChangeIntervalRef) clearInterval(addressChangeIntervalRef); // addressChangeIntervalRef = setInterval(async () => {
  //   const accounts = await connector.accounts();
  //   if (_.isEqual(accounts, addresses)) return;
  //   console.log("accounts", accounts);
  //   addresses = accounts;
  //   store.dispatch(actions.AccountChanged(accounts[0]));
  // }, 1000);

  connector.on("connect", function (error, payload) {
    if (error) {
      throw error;
    } // Close QR Code Modal


    _qrcodeModal.default.close(); // Get provided accounts and chainId


    var _payload$params$ = payload.params[0],
        accounts = _payload$params$.accounts,
        chainId = _payload$params$.chainId;
    addresses = accounts;
    return _store.default.dispatch(actions.WalletConnected({
      address: accounts[0],
      chain_id: chainId,
      loader: _constant.LOADERS.WalletConnect,
      explorer: _constant.CHAIN_DATA[chainId]
    }));
  });
  connector.on("session_update", function (error, payload) {
    if (error) {
      throw error;
    } // Get updated accounts and chainId


    var _payload$params$2 = payload.params[0],
        accounts = _payload$params$2.accounts,
        chainId = _payload$params$2.chainId;
    addresses = accounts;

    _store.default.dispatch(actions.AccountChanged(accounts[0]));

    _store.default.dispatch(actions.NetworkChanged(chainId));
  });
  connector.on("disconnect", function (error, payload) {
    if (error) {
      throw error;
    }

    return _store.default.dispatch(actions.WalletDisconnected()); // Delete connector
  });
  window.ethereum.on("message", function (data) {
    console.log("message", data);
  });
}

function SendTransaction(_x) {
  return _SendTransaction.apply(this, arguments);
}

function _SendTransaction() {
  _SendTransaction = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(tx) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log(tx, "transaction");
            return _context4.abrupt("return", new Promise(function (resolve, reject) {
              connector.sendTransaction(tx).then(function (result) {
                // Returns transaction id (hash)
                console.log(result);
                resolve(result);
              }).catch(function (error) {
                // Error returned when rejected
                reject(error);
                reject({
                  message: "Transaction Failed"
                });
                console.error(error);
              });
            }));

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _SendTransaction.apply(this, arguments);
}