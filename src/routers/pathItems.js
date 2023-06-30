import React from 'react'
import namePath from '../routers/namePath'

const LazyAuctionsTransports = React.lazy(() =>
  import('../views/Auto/AuctionsTransports ')
)
const LazyNoticeTransport = React.lazy(() => import('../views/NoticeTransport'))
const LazyProfileUser = React.lazy(() => import('../views/ProfileUser'))
const LazyAuctionsTransportsControl = React.lazy(() =>
  import('../views/Auto/AuctionsTransportsControl')
)
const LazyContainers = React.lazy(() => import('../views/Containers.jsx'))
const LazyContainersImport = React.lazy(() =>
  import('../views/ContainersImport')
)
const CostsPurchasePoint = React.lazy(() =>
  import('../views/CostsPurchasePoint')
)
const CostsLoadingPort = React.lazy(() => import('../views/CostsLoadingPort'))
const CostsDestinationPort = React.lazy(() =>
  import('../views/CostsDestinationPort')
)
const CostsDestination = React.lazy(() => import('../views/CostsDestination'))
const LazyContainerInfoDetails = React.lazy(() =>
  import('../components/ContainerInfoDetails')
)
const LazyRatesControl = React.lazy(() => import('../views/RatesControl'))
const LazyAgLogisticInlandRates = React.lazy(() =>
  import('../components/AgLogisticInlandRates')
)
const LazyAgLogisticDestinationInlandRates = React.lazy(() =>
  import('../components/AgLogisticDestinationInlandRates')
)
const LazyMasters = React.lazy(() => import('../views/Users/Masters.jsx'))
const LazyMastersCreate = React.lazy(() =>
  import('../views/Users/MastersCreate.jsx')
)
const LazyMastersEdit = React.lazy(() =>
  import('../views/Users/MastersEdit.jsx')
)

const LazyMastersfinances = React.lazy(() =>
  import('../views/Users/Mastersfinances.jsx')
)
const LazyMastersfinancesCreate = React.lazy(() =>
  import('../views/Users/MastersfinancesCreate.jsx')
)
const LazyMastersfinancesEdit = React.lazy(() =>
  import('../views/Users/MastersfinancesEdit.jsx')
)
const LazyAssignPermissionsToRoles = React.lazy(() =>
  import('../views/AssignPermissionsToRoles.jsx')
)

const LazyLogist = React.lazy(() => import('../views/Users/Logist.jsx'))
const LazyLogistEdit = React.lazy(() => import('../views/Users/LogistEdit.jsx'))
const LazyLogistCreate = React.lazy(() =>
  import('../views/Users/LogistCreate.jsx')
)

const LazyOffice = React.lazy(() => import('../views/Users/Office.jsx'))

const LazyOfficeCreate = React.lazy(() =>
  import('../views/Users/OfficeCreate.jsx')
)
const LazyOfficeEdit = React.lazy(() => import('../views/Users/OfficeEdit.jsx'))

const LazyDealers = React.lazy(() => import('../views/Users/Dealers.jsx'))

const LazyDealersCreate = React.lazy(() =>
  import('../views/Users/DealersCreate.jsx')
)
const LazyDealersEdit = React.lazy(() =>
  import('../views/Users/DealersEdit.jsx')
)

const LazySubUsers = React.lazy(() => import('../views/Users/SubUsers.jsx'))

const LazySubUsersCreate = React.lazy(() =>
  import('../views/Users/SubUsersCreate.jsx')
)
const LazySubUsersEdit = React.lazy(() =>
  import('../views/Users/SubUsersEdit.jsx')
)

const LazyArchive = React.lazy(() => import('../views/Users/Archive.jsx'))
const LazyLocation = React.lazy(() => import('../views/Location'))
const LazyDestinations = React.lazy(() => import('../views/Destinations'))
const LazyPlaceDestinations = React.lazy(() =>
  import('../views/PlaceDestinations')
)

const LazyBrandsModels = React.lazy(() => import('../views/BrandsModels'))
const LazyCredentials = React.lazy(() => import('../views/Credentials'))

const LazyAgent = React.lazy(() => import('../views/Agent'))
const LazyAgentProfile = React.lazy(() => import('../views/AgentProfile'))
const LazyAgentAddProfile = React.lazy(() => import('../views/AgentAddProfile'))
const LazyAgentCarrierAddProfile = React.lazy(() =>
  import('../views/AgentCarrierAddProfile')
)

const LazyCarter = React.lazy(() => import('../views/Сarter'))
const LazyСarterProfile = React.lazy(() => import('../views/CarterProfile'))
const LazyСarterAddProfile = React.lazy(() =>
  import('../views/CarterAddProfile')
)

const LazyCarriers = React.lazy(() => import('../views/Carriers'))

const LazyPreBid = React.lazy(() => import('../views/PreBid/PreBid'))
const LazyPreBidContrPrice = React.lazy(() =>
  import('../views/PreBid/PreBidContrPrice')
)
const LazyArhivePreBid = React.lazy(() =>
  import('../views/PreBid/ArhivePreBid')
)

const LazyWallets = React.lazy(() => import('../views/Wallets'))
const LazyСalculator = React.lazy(() => import('../components/Сalculator'))
const LazyAgCalculatorSetting = React.lazy(() =>
  import('../views/AgCalculatorSetting')
)

const LazyAuthorization = React.lazy(() => import('../views/Authorization.jsx'))
const LazyVatianView = React.lazy(() => import('../components/VatrianView.jsx'))
const LazyListOfAuctions = React.lazy(() =>
  import('../views/ListOfAuctions.jsx')
)
const LazyPaymentMethod = React.lazy(() =>
  import('../components/PaymentMethod')
)

const LazyPortOfLoading = React.lazy(() => import('../views/PortOfLoading'))
const LazyListOfCountries = React.lazy(() => import('../views/ListOfCountries'))
const LazyListOfPorts = React.lazy(() => import('../views/ListOfPorts'))
const ListOfСounterparty = React.lazy(() =>
  import('../views/ListOfСounterparty')
)
const LazyCarrierOfWallets = React.lazy(() =>
  import('../views/CarrierOfWallets')
)
const LazyListOfAgents = React.lazy(() => import('../views/ListOfAgents'))
const LazyListOfAgentEdit = React.lazy(() => import('../views/ListOfAgentEdit'))
const LazyListOfAgentAdd = React.lazy(() => import('../views/ListOfAgentsAdd'))

const pathItems = [
  { path: namePath.DEFAULT, element: <LazyAuctionsTransports /> },

  { path: namePath.PLACE_VARIANT, element: <LazyVatianView /> },

  {
    path: namePath.AUTH_DATA,
    element: <LazyAuthorization />,
  },

  {
    path: namePath.NOTICETRANSPORT,
    element: <LazyNoticeTransport />,
  },
  {
    path: namePath.PROFILEUSER,
    element: <LazyProfileUser />,
  },
  {
    path: namePath.ARCHIVE_TRANSPORT,
    element: <LazyAuctionsTransports />,
  },
  {
    path: namePath.AUCTIONS_TRANSPORTSNOTALL,
    element: <LazyAuctionsTransports />,
  },
  {
    path: namePath.AUCTIONS_INSALE,
    element: <LazyAuctionsTransports />,
  },

  {
    path: namePath.AUCTION_TRANSPORT_ACTION,
    element: <LazyAuctionsTransportsControl />,
  },
  {
    path: namePath.AUCTION_TRANSPORT_ACTION_ID,
    element: <LazyAuctionsTransportsControl />,
  },
  {
    path: namePath.AUCTION_TRANSPORT_ACTION_ID_ACTIONAUTO,
    element: <LazyAuctionsTransportsControl />,
  },
  {
    path: namePath.AUCTION_TRANSPORT_ACTION_ID_ACTIONAUTO_IDSHIPPING,
    element: <LazyAuctionsTransportsControl />,
  },

  {
    path: namePath.AUCTION_TRANSPORTNOTALL_ACTION,
    element: <LazyAuctionsTransportsControl />,
  },
  {
    path: namePath.AUCTION_TRANSPORTNOTALL_ACTION_ID,
    element: <LazyAuctionsTransportsControl />,
  },
  {
    path: namePath.AUCTION_TRANSPORTNOTALL_ACTION_ID_ACTIONAUTO,
    element: <LazyAuctionsTransportsControl />,
  },
  {
    path: namePath.AUCTION_TRANSPORTNOTALL_ACTION_ID_ACTIONAUTO_IDSHIPPING,
    element: <LazyAuctionsTransportsControl />,
  },

  {
    path: namePath.ARCHIVE_TRANSPORT,
    element: <LazyAuctionsTransportsControl />,
  },
  {
    path: namePath.REMOVED_TRANSPORT,
    element: <LazyAuctionsTransports />,
  },

  {
    path: namePath.ARCHIVE_TRANSPORT_ACTION,
    element: <LazyAuctionsTransportsControl />,
  },
  {
    path: namePath.ARCHIVE_TRANSPORT_ACTION_ID,
    element: <LazyAuctionsTransportsControl />,
  },
  {
    path: namePath.ARCHIVE_TRANSPORT_ACTION_ID_ACTIONAUTO,
    element: <LazyAuctionsTransportsControl />,
  },
  {
    path: namePath.ARCHIVE_TRANSPORT_ACTION_ID_ACTIONAUTO_IDSHIPPING,
    element: <LazyAuctionsTransportsControl />,
  },

  {
    path: namePath.REMOVED_TRANSPORT_ACTION,
    element: <LazyAuctionsTransportsControl />,
  },
  {
    path: namePath.REMOVED_TRANSPORT_ACTION_ID,
    element: <LazyAuctionsTransportsControl />,
  },
  {
    path: namePath.REMOVED_TRANSPORT_ACTION_ID_ACTIONAUTO,
    element: <LazyAuctionsTransportsControl />,
  },
  {
    path: namePath.REMOVED_TRANSPORT_ACTION_ID_ACTIONAUTO_IDSHIPPING,
    element: <LazyAuctionsTransportsControl />,
  },

  { path: namePath.CONTAINERS_ARCHIVE, element: <LazyContainers /> },
  { path: namePath.CONTAINERS_CONTAINER, element: <LazyContainers /> },
  { path: namePath.CONTAINERS_UNCONFIRM, element: <LazyContainers /> },
  { path: namePath.CONTAINERS_LOADING, element: <LazyContainers /> },
  { path: namePath.CONTAINERS_IMPORT, element: <LazyContainersImport /> },
  { path: namePath.COSTS_PURCHASE_POINT, element: <CostsPurchasePoint /> },
  { path: namePath.COSTS_LOADING_PORT, element: <CostsLoadingPort /> },
  { path: namePath.COSTS_DESTINATION_PORT, element: <CostsDestinationPort /> },
  { path: namePath.COSTS_DESTINATION, element: <CostsDestination /> },

  {
    path: namePath.UNCONTAINERS_ID_INFO,
    element: <LazyContainerInfoDetails />,
  },
  { path: namePath.CONTAINERS_ID_INFO, element: <LazyContainerInfoDetails /> },
  { path: namePath.CALCULATOR_FORNAME, element: <LazyСalculator /> },
  { path: namePath.PRE_BID, element: <LazyPreBid /> },
  { path: namePath.CONTRPRICE, element: <LazyPreBidContrPrice /> },
  { path: namePath.ARHIVEPREBID, element: <LazyArhivePreBid /> },
  { path: namePath.AEC_NAMERATES, element: <LazyRatesControl /> },
  { path: namePath.AUTO_UNIVERSE_NAMERATES, element: <LazyRatesControl /> },
  { path: namePath.AGLOGISTIC_NAMERATES, element: <LazyRatesControl /> },
  {
    path: namePath.AGLOGISTIC_INLANDRATES,
    element: <LazyAgLogisticInlandRates />,
  },
  {
    path: namePath.AGLOGISTIC_DESTINATION,
    element: <LazyAgLogisticDestinationInlandRates />,
  },
  { path: namePath.SETTING, element: <LazyAgCalculatorSetting /> },
  { path: namePath.AGLOGISTIC_SEARATES, element: <LazyAgCalculatorSetting /> },
  { path: namePath.WALLETS_NAME, element: <LazyWallets /> },
  { path: namePath.MASTERS, element: <LazyMasters /> },
  { path: namePath.MASTERS_CREATE, element: <LazyMastersCreate /> },
  { path: namePath.MASTERS_ID_EDIT, element: <LazyMastersEdit /> },
  { path: namePath.LOGIST, element: <LazyLogist /> },
  { path: namePath.LOGIST_CREATE, element: <LazyLogistCreate /> },
  { path: namePath.LOGIST_ID_EDIT, element: <LazyLogistEdit /> },
  { path: namePath.MASTERSFINANCES, element: <LazyMastersfinances /> },
  {
    path: namePath.MASTERSFINANCES_CREATE,
    element: <LazyMastersfinancesCreate />,
  },
  {
    path: namePath.MASTERSFINANCES_ID_EDIT,
    element: <LazyMastersfinancesEdit />,
  },
  { path: namePath.OFFICE, element: <LazyOffice /> },
  { path: namePath.OFFICE_CREATE, element: <LazyOfficeCreate /> },
  { path: namePath.OFFICE_ID_EDIT, element: <LazyOfficeEdit /> },
  { path: namePath.OFFICEDEALERS, element: <LazyOffice /> },
  { path: namePath.OFFICEDEALERS_CREATE, element: <LazyOfficeCreate /> },
  { path: namePath.OFFICEDEALERS_ID_EDIT, element: <LazyOfficeEdit /> },
  { path: namePath.DEALERS, element: <LazyDealers /> },
  { path: namePath.DEALERS_CREATE, element: <LazyDealersCreate /> },
  { path: namePath.DEALERS_ID_EDIT, element: <LazyDealersEdit /> },
  { path: namePath.SUBUSERS, element: <LazySubUsers /> },
  { path: namePath.SUBUSERS_CREATE, element: <LazySubUsersCreate /> },
  { path: namePath.SUBUSERS_ID_EDIT, element: <LazySubUsersEdit /> },
  { path: namePath.ARCHIVE, element: <LazyArchive /> },
  {
    path: namePath.AGENTCARRIERADDPROFILE,
    element: <LazyAgentCarrierAddProfile />,
  },

  { path: namePath.AGENT, element: <LazyAgent /> },
  { path: namePath.AGENTPROFILE, element: <LazyAgentProfile /> },
  { path: namePath.AGENTADDPROFILE, element: <LazyAgentAddProfile /> },

  { path: namePath.CARTER, element: <LazyCarter /> },

  { path: namePath.CARTERPROFILE, element: <LazyСarterProfile /> },
  { path: namePath.CARTERADDPROFILE, element: <LazyСarterAddProfile /> },

  { path: namePath.CARRIER, element: <LazyCarriers /> },
  {
    path: namePath.ASSIGN_PERMISSIONS_TO_ROLES,
    element: <LazyAssignPermissionsToRoles />,
  },
  { path: namePath.LOCATION, element: <LazyLocation /> },
  { path: namePath.DESTINATIONS, element: <LazyDestinations /> },
  { path: namePath.PLACE_DESTINATIONS, element: <LazyPlaceDestinations /> },
  { path: namePath.SERVICES_BRANDS_MODELS, element: <LazyBrandsModels /> },
  { path: namePath.CREDENTIALS, element: <LazyCredentials /> },
  { path: namePath.LISTOFAUCTIONS, element: <LazyListOfAuctions /> },
  { path: namePath.PAYMENTMETHOD, element: <LazyPaymentMethod /> },
  { path: namePath.PORTOFLOADING, element: <LazyPortOfLoading /> },
  { path: namePath.LISTOFCOUNTRIES, element: <LazyListOfCountries /> },
  { path: namePath.LISTOFPORTS, element: <LazyListOfPorts /> },
  { path: namePath.COUNTERPARTY, element: <ListOfСounterparty /> },
  { path: namePath.CARRIEROFWALLETS, element: <LazyCarrierOfWallets /> },
  { path: namePath.LISTOFAGENTS, element: <LazyListOfAgents /> },
  { path: namePath.LISTOFAGENTEDIT, element: <LazyListOfAgentEdit /> },
  { path: namePath.LISTOFAGENTADD, element: <LazyListOfAgentAdd /> },
]
export { pathItems }
