"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Disconnect = Disconnect;
exports.GetChainId = GetChainId;
exports.GetProvider = GetProvider;
exports.IsWalletConnectSupported = IsWalletConnectSupported;
exports.SendTransaction = SendTransaction;
exports._initListerner = _initListerner;
exports.addXDCTestNetwork = addXDCTestNetwork;
exports.addXDCnetwork = addXDCnetwork;
exports.checkConnection = checkConnection;
exports.initWalletConnect = initWalletConnect;
exports.switchNetwork = switchNetwork;
exports.switchToXDCNetwork = switchToXDCNetwork;

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

            if (!connector.session.connected) {
              _context3.next = 5;
              break;
            }

            _context3.next = 5;
            return connector.killSession();

          case 5:
            GetProvider().then(function (res) {
              console.log("provider", res);
            });
            connector.createSession().then(function () {
              // get uri for QR Code modal
              var uri = connector.uri; // display QR Code modal

              _qrcodeModal.default.open(uri, function () {
                console.log("QR Code Modal closed");
              });
            });

            _initListerner();

            _context3.next = 18;
            break;

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);

            if (!(_context3.t0 === "timeout")) {
              _context3.next = 16;
              break;
            }

            (0, _reactToastify.toast)( /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
              children: "Error while connecting to WalletConnect: Timeout. Please check your WalletConnect or try after refresh."
            }), {
              autoClose: false
            });
            return _context3.abrupt("return", _store.default.dispatch(actions.WalletDisconnected()));

          case 16:
            (0, _reactToastify.toast)( /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
              children: "Error while connecting to WalletConnect provider"
            }), {
              autoClose: false
            });
            return _context3.abrupt("return", _store.default.dispatch(actions.WalletDisconnected()));

          case 18:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 10]]);
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
    localStorage.removeItem(_constant.XDC_PAY);
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

function switchToXDCNetwork(_x) {
  return _switchToXDCNetwork.apply(this, arguments);
}

function _switchToXDCNetwork() {
  _switchToXDCNetwork = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(chainId) {
    var _connector;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log("baseConnector", connector);

            if (!(connector === undefined)) {
              _context4.next = 15;
              break;
            }

            _connector = new _node.default({
              bridge: "https://bridge.walletconnect.org" // Required

            }, {
              clientMeta: {
                description: "WalletConnect NodeJS Client",
                url: "https://nodejs.org/en/",
                icons: ["https://nodejs.org/static/images/logo.svg"],
                name: "WalletConnect"
              }
            });
            _context4.prev = 3;
            _context4.next = 6;
            return addXDCTestNetwork(_connector);

          case 6:
            _context4.next = 8;
            return switchNetwork(_connector, chainId);

          case 8:
            _store.default.dispatch(actions.NetworkChanged(chainId));

            _context4.next = 13;
            break;

          case 11:
            _context4.prev = 11;
            _context4.t0 = _context4["catch"](3);

          case 13:
            _context4.next = 25;
            break;

          case 15:
            _context4.prev = 15;
            _context4.next = 18;
            return addXDCTestNetwork(connector);

          case 18:
            _context4.next = 20;
            return switchNetwork(connector, chainId);

          case 20:
            _store.default.dispatch(actions.NetworkChanged(chainId));

            _context4.next = 25;
            break;

          case 23:
            _context4.prev = 23;
            _context4.t1 = _context4["catch"](15);

          case 25:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[3, 11], [15, 23]]);
  }));
  return _switchToXDCNetwork.apply(this, arguments);
}

function switchNetwork(_x2, _x3) {
  return _switchNetwork.apply(this, arguments);
}

function _switchNetwork() {
  _switchNetwork = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(_connector, chainId) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _connector.sendCustomRequest({
              id: 1,
              jsonrpc: "2.0",
              method: "wallet_switchEthereumChain",
              params: [{
                chainId: chainId
              }]
            }).then( /*#__PURE__*/function () {
              var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(res) {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        console.log("Response", res);

                        _reactToastify.toast.success("Network switched!", {
                          autoClose: 5000,
                          hideProgressBar: true,
                          closeOnClick: true,
                          progress: undefined
                        });

                      case 2:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x7) {
                return _ref.apply(this, arguments);
              };
            }()).catch(function (err) {
              console.log("Error", err);
            });

          case 1:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _switchNetwork.apply(this, arguments);
}

;

function addXDCnetwork(_x4) {
  return _addXDCnetwork.apply(this, arguments);
}

function _addXDCnetwork() {
  _addXDCnetwork = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(_connector) {
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _connector.sendCustomRequest({
              id: 1,
              jsonrpc: "2.0",
              method: "wallet_addEthereumChain",
              params: [{
                chainId: "0x32",
                chainName: "Xinfin",
                rpcUrls: ["https://xdcpayrpc.blocksscan.io/"],
                nativeCurrency: {
                  name: "XDC",
                  symbol: "XDC",
                  decimals: 18
                },
                blockExplorerUrls: ["https://observer.xdc.org"]
              }]
            }).then( /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(res) {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        console.log("Response", res);

                      case 1:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              }));

              return function (_x8) {
                return _ref2.apply(this, arguments);
              };
            }()).catch(function (err) {
              console.log("Error", err);
            });

          case 1:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _addXDCnetwork.apply(this, arguments);
}

function addXDCTestNetwork(_x5) {
  return _addXDCTestNetwork.apply(this, arguments);
}

function _addXDCTestNetwork() {
  _addXDCTestNetwork = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(_connector) {
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _connector.sendCustomRequest({
              id: 1,
              jsonrpc: "2.0",
              method: "wallet_addEthereumChain",
              params: [{
                chainId: "0x33",
                chainName: "Xinfin",
                rpcUrls: ["https://apothemxdcpayrpc.blocksscan.io/"],
                nativeCurrency: {
                  name: "XDC",
                  symbol: "XDC",
                  decimals: 18
                },
                blockExplorerUrls: ["https://explorer.apothem.network"]
              }]
            }).then( /*#__PURE__*/function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(res) {
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        console.log("Response", res);

                      case 1:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              }));

              return function (_x9) {
                return _ref3.apply(this, arguments);
              };
            }()).catch(function (err) {
              console.log("Error", err);
            });

          case 1:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));
  return _addXDCTestNetwork.apply(this, arguments);
}

function SendTransaction(_x6) {
  return _SendTransaction.apply(this, arguments);
}

function _SendTransaction() {
  _SendTransaction = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(tx) {
    var to;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            to = tx["to"];
            to = "0x".concat(to.substring(3, to.length));
            tx["to"] = to;
            console.log(tx, "transaction");
            return _context13.abrupt("return", new Promise(function (resolve, reject) {
              connector.sendTransaction(tx).then( /*#__PURE__*/function () {
                var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(result) {
                  var interval;
                  return regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                      switch (_context12.prev = _context12.next) {
                        case 0:
                          try {
                            interval = setInterval( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
                              var provider, xdc3, receipt;
                              return regeneratorRuntime.wrap(function _callee11$(_context11) {
                                while (1) {
                                  switch (_context11.prev = _context11.next) {
                                    case 0:
                                      _context11.next = 2;
                                      return GetProvider();

                                    case 2:
                                      provider = _context11.sent;
                                      xdc3 = new _xdc.default(provider);
                                      _context11.next = 6;
                                      return xdc3.eth.getTransactionReceipt(result);

                                    case 6:
                                      receipt = _context11.sent;

                                      if (receipt && receipt.status) {
                                        resolve(receipt);
                                        clearInterval(interval);
                                      }

                                    case 8:
                                    case "end":
                                      return _context11.stop();
                                  }
                                }
                              }, _callee11);
                            })), 2000);
                          } catch (error) {
                            clearInterval(interval);
                            reject(error);
                            reject({
                              message: "Transaction Failed"
                            });
                            console.error(error);
                          }

                          ;

                        case 2:
                        case "end":
                          return _context12.stop();
                      }
                    }
                  }, _callee12);
                }));

                return function (_x10) {
                  return _ref4.apply(this, arguments);
                };
              }());
            }));

          case 5:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));
  return _SendTransaction.apply(this, arguments);
}

function Disconnect() {
  return _Disconnect.apply(this, arguments);
}

function _Disconnect() {
  _Disconnect = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            if (!connector) {
              _context14.next = 3;
              break;
            }

            _context14.next = 3;
            return connector.killSession();

          case 3:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));
  return _Disconnect.apply(this, arguments);
}

function checkConnection() {
  console.log("Connector: ", connector);
}

;