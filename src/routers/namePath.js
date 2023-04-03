const namePath = {
  DEFAULT: '/',
  NOTICETRANSPORT: '/noticeTransport/:idUsers',
  PROFILEUSER: '/profileUser/:idUsers',
  AUTH_DATA: '/auth_data/:token',
  AUCTION_TRANSPORT_ACTION: '/auction-transport/:action',
  AUCTIONS_TRANSPORTSNOTALL: '/auctions-transportsNotAll',
  AUCTIONS_INSALE: '/auctions-inSale',
  AUCTION_TRANSPORT_ACTION_ID: '/auction-transport/:action/:id',
  AUCTION_TRANSPORT_ACTION_ID_ACTIONAUTO:
    '/auction-transport/:action/:id/:actionAuto',
  AUCTION_TRANSPORT_ACTION_ID_ACTIONAUTO_IDSHIPPING:
    '/auction-transport/:action/:id/:actionAuto/:idShipping',

  AUCTION_TRANSPORTNOTALL_ACTION: '/auction-transportNotAll/:action',
  AUCTION_TRANSPORTNOTALL_ACTION_ID: '/auction-transportNotAll/:action/:id',
  AUCTION_TRANSPORTNOTALL_ACTION_ID_ACTIONAUTO:
    '/auction-transportNotAll/:action/:id/:actionAuto',
  AUCTION_TRANSPORTNOTALL_ACTION_ID_ACTIONAUTO_IDSHIPPING:
    '/auction-transportNotAll/:action/:id/:actionAuto/:idShipping',

  ARCHIVE_TRANSPORT: '/archiveTransport',
  REMOVED_TRANSPORT: '/removedTransport',

  ARCHIVE_TRANSPORT_ACTION: '/archiveTransport/:action',
  ARCHIVE_TRANSPORT_ACTION_ID: '/archiveTransport/:action/:id',
  ARCHIVE_TRANSPORT_ACTION_ID_ACTIONAUTO:
    '/archiveTransport/:action/:id/:actionAuto',
  ARCHIVE_TRANSPORT_ACTION_ID_ACTIONAUTO_IDSHIPPING:
    '/archiveTransport/:action/:id/:actionAuto/:idShipping',

  REMOVED_TRANSPORT_ACTION: '/removedTransport/:action',
  REMOVED_TRANSPORT_ACTION_ID: '/removedTransport/:action/:id',
  REMOVED_TRANSPORT_ACTION_ID_ACTIONAUTO:
    '/removedTransport/:action/:id/:actionAuto',
  REMOVED_TRANSPORT_ACTION_ID_ACTIONAUTO_IDSHIPPING:
    '/removedTransport/:action/:id/:actionAuto/:idShipping',

  CONTAINERS_IMPORT: '/containers/import',
  COSTS_PURCHASE_POINT: '/costs/purchase-point',
  COSTS_LOADING_PORT: '/costs/loading-port',
  COSTS_DESTINATION_PORT: '/costs/destination-port',
  COSTS_DESTINATION: '/costs/destination',
  CONTAINERS_ARCHIVE: '/containers/archive',
  CONTAINERS_CONTAINER: '/containers/container',
  CONTAINERS_UNCONFIRM: '/containers/unconfirm',
  CONTAINERS_LOADING: '/containers/loading',
  UNCONTAINERS_ID_INFO: '/uncontainers/:id/info',
  CONTAINERS_ID_INFO: '/containers/:id/info',
  CALCULATOR_FORNAME: '/calculator/:forName',
  PRE_BID: '/pre-Bid',
  CONTRPRICE: '/contrPrice',
  ARHIVEPREBID: '/arhivePreBid',
  AEC_NAMERATES: '/aec/:nameRates',
  AUTO_UNIVERSE_NAMERATES: '/auto_universe/:nameRates',
  AGLOGISTIC_NAMERATES: '/aglogistic/:nameRatesLink',
  SETTING: '/setting',
  LISTAUCTIONS: '/listAutions',
  PAYMENTMETHOD: '/paymentMethod',

  AGLOGISTIC_SEARATES: '/aglogistic/searates',
  WALLETS_NAME: '/wallets/:name',
  MASTERS: '/masters',
  MASTERS_CREATE: '/masters/create',
  MASTERS_ID_EDIT: '/masters/:id/edit',
  LOGIST: '/logist',
  LOGIST_CREATE: '/logist/create',
  LOGIST_ID_EDIT: '/logist/:id/edit',
  MASTERSFINANCES: '/mastersfinances',
  MASTERSFINANCES_CREATE: '/mastersfinances/create',
  MASTERSFINANCES_ID_EDIT: '/mastersfinances/:id/edit',
  OFFICE: '/office',
  OFFICE_CREATE: '/office/create',
  OFFICE_ID_EDIT: '/office/:id/edit',
  OFFICEDEALERS: '/officeDealers',
  OFFICEDEALERS_CREATE: '/officeDealers/create',
  OFFICEDEALERS_ID_EDIT: '/officeDealers/:id/edit',
  DEALERS: '/dealers',
  DEALERS_CREATE: '/dealers/create',
  DEALERS_ID_EDIT: '/dealers/:id/edit',
  SUBUSERS: '/subusers',
  SUBUSERS_CREATE: '/subusers/create',
  SUBUSERS_ID_EDIT: '/subusers/:id/edit',
  ARCHIVE: '/archive',

  AGENT: '/agent',
  AGENTPROFILE: '/agentProfile/:id',
  AGENTADDPROFILE: '/agentAddProfile',

  CARTER: '/carter',
  CARTERPROFILE: '/carterProfile/:id',
  CARTERADDPROFILE: '/carterAddProfile',

  CARRIER: '/carrier',
  ASSIGN_PERMISSIONS_TO_ROLES: '/assign-permissions-to-roles',
  LOCATION: '/location',
  DESTINATIONS: '/destinations',
  PLACE_DESTINATIONS: '/place-destinations',
  SERVICES_BRANDS_MODELS: '/services/brands-models',
  CREDENTIALS_COPART_OPEN: '/credentials/copart/open',
  PLACE_VARIANT: '/:name/variant/',
}

export default namePath