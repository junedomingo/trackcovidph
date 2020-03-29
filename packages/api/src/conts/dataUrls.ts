/**
 * Based on https://ncovtracker.doh.gov.ph/ API endpoints
 */
export enum DATA_URLS {
  ARCGIS_BASE_URL = 'https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/',

  ARCGIS_CONFIRMED_LOCALS = 'PH_masterlist/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=sequ%20desc',
  ARCGIS_CONFIRMED_OFWs = 'OF_masterlist/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=num desc&resultOffset=0&resultRecordCount=200&cacheHint=true',
  ARCGIS_CONFIRMED_FOREIGN_NATIONALS = 'FN_masterlist/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=FID desc&resultOffset=0&resultRecordCount=25&cacheHint=true',
  ARCGIS_CONFIRMED_BY_HEALTH_FACILITY = 'conf_fac_tracking/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=count_%20desc&resultOffset=0&resultRecordCount=50&cacheHint=true',
  ARCGIS_PUIs_BY_HEALTH_FACILITY = 'PUI_fac_tracing/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*',
  ARCGIS_CONFIRMED_BY_RESIDENCE = 'PH_masterlist/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&groupByFieldsForStatistics=residence&orderByFields=value desc&outStatistics=[{"statisticType"%3A"count"%2C"onStatisticField"%3A"FID"%2C"outStatisticFieldName"%3A"value"}]&cacheHint=true',
  ARCGIS_CONFIRMED_BY_AGE_GROUP = 'age_group/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&groupByFieldsForStatistics=age_categ%2Csex&outStatistics=[{"statisticType"%3A"count"%2C"onStatisticField"%3A"FID"%2C"outStatisticFieldName"%3A"value"}]&outSR=102100&cacheHint=true',
  ARCGIS_COUNT = 'slide_fig/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*',
}
