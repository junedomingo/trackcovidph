import { RESTDataSource } from 'apollo-datasource-rest';

import { DATA_URLS } from '../conts';
import {
  ArcGISConfirmedByHealthFacilityAttrs,
  ArcGISConfirmedByResidenceAttrs,
  ArcGISConfirmedForeignNationalAttrs,
  ArcGISConfirmedLocalAttrs,
  ArcGISConfirmedOFWAttrs,
  ArcGISCountsAttrs,
  ArcGISPUIByHealthFacilityAttrs,
  ArcGISResponse,
} from '../types';
import { parseToJSON, sanitizeResponse, isDummy, getDummyData } from '../utils';

export class ArcGISApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = DATA_URLS.ARCGIS_BASE_URL;
  }

  async getCount(): Promise<ArcGISResponse<ArcGISCountsAttrs>> {
    try {
      const response: string = await this.get(DATA_URLS.ARCGIS_COUNT);
      return sanitizeResponse(parseToJSON(response));
    } catch (error) {
      throw error;
    }
  }

  async getConfirmedLocals(): Promise<ArcGISResponse<ArcGISConfirmedLocalAttrs>> {
    try {
      if (isDummy()) {
        return sanitizeResponse(
          parseToJSON(getDummyData(`${__dirname}/dummyData/DummyDataConfirmedLocals.json`))
        );
      }
      const response: string = await this.get(DATA_URLS.ARCGIS_CONFIRMED_LOCALS);
      return sanitizeResponse(parseToJSON(response));
    } catch (error) {
      throw error;
    }
  }

  async getConfirmedByHealthFacility(): Promise<
    ArcGISResponse<ArcGISConfirmedByHealthFacilityAttrs>
  > {
    try {
      const response: string = await this.get(DATA_URLS.ARCGIS_CONFIRMED_BY_HEALTH_FACILITY);
      return sanitizeResponse(parseToJSON(response));
    } catch (error) {
      throw error;
    }
  }

  async getPUIsByHealthFacility(): Promise<ArcGISResponse<ArcGISPUIByHealthFacilityAttrs>> {
    try {
      const response: string = await this.get(DATA_URLS.ARCGIS_PUIs_BY_HEALTH_FACILITY);
      return sanitizeResponse(parseToJSON(response));
    } catch (error) {
      throw error;
    }
  }

  async getConfirmedByResidence(): Promise<ArcGISResponse<ArcGISConfirmedByResidenceAttrs>> {
    try {
      const response: string = await this.get(DATA_URLS.ARCGIS_CONFIRMED_BY_RESIDENCE);
      return sanitizeResponse(parseToJSON(response));
    } catch (error) {
      throw error;
    }
  }

  async getConfirmedOFWs(): Promise<ArcGISResponse<ArcGISConfirmedOFWAttrs>> {
    try {
      const response: string = await this.get(DATA_URLS.ARCGIS_CONFIRMED_OFWs);
      return sanitizeResponse(parseToJSON(response));
    } catch (error) {
      throw error;
    }
  }

  async getConfirmedForeignNationals(): Promise<
    ArcGISResponse<ArcGISConfirmedForeignNationalAttrs>
  > {
    try {
      const response = await this.get(DATA_URLS.ARCGIS_CONFIRMED_FOREIGN_NATIONALS);
      return sanitizeResponse(parseToJSON(response));
    } catch (error) {
      throw error;
    }
  }
}
