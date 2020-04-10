/**
 * Based on https://ncovtracker.doh.gov.ph/ API endpoints
 */
export enum ENDPOINTS {
  ARCGIS_BASE_URL = 'https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/',

  ARCGIS_CONFIRMED_LOCALS = 'PH_masterlist/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=sequ%20asc&resultOffset=0',
  ARCGIS_CONFIRMED_OFWS = 'OF_masterlist/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=num desc&resultOffset=0&resultRecordCount=200&cacheHint=true',
  ARCGIS_CONFIRMED_FOREIGN_NATIONALS = 'FN_masterlist/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=FID desc&resultOffset=0&resultRecordCount=25&cacheHint=true',
  ARCGIS_CONFIRMED_PER_HEALTH_FACILITY = 'conf_fac_tracking/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=count_%20desc&resultOffset=0&resultRecordCount=50&cacheHint=true',
  ARCGIS_PUIS_PER_HEALTH_FACILITY = 'PUI_fac_tracing/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*',
  ARCGIS_CONFIRMED_PER_RESIDENCE = 'PH_masterlist/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&groupByFieldsForStatistics=residence&orderByFields=value desc&outStatistics=[{"statisticType"%3A"count"%2C"onStatisticField"%3A"FID"%2C"outStatisticFieldName"%3A"value"}]&cacheHint=true',
  ARCGIS_CONFIRMED_PER_AGE_GROUP = 'age_group/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&groupByFieldsForStatistics=age_categ%2Csex&outStatistics=[{"statisticType"%3A"count"%2C"onStatisticField"%3A"FID"%2C"outStatisticFieldName"%3A"value"}]&outSR=102100&cacheHint=true',
  ARCGIS_COUNTS = 'slide_fig/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*',
}
