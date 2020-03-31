import { RESTDataSource } from 'apollo-datasource-rest';

import { DATA_URLS } from '../conts';
import {
  ArcGISConfirmedPerHealthFacilityAttrs,
  ArcGISConfirmedPerResidenceAttrs,
  ArcGISConfirmedForeignNationalAttrs,
  ArcGISConfirmedLocalAttrs,
  ArcGISConfirmedOFWAttrs,
  ArcGISCountAttrs,
  ArcGISPUIPerHealthFacilityAttrs,
  ArcGISResponse,
} from '../types';
import { parseToJSON, sanitizeResponse, isDummy, getDummyData } from '../utils';

export class ArcGISApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = DATA_URLS.ARCGIS_BASE_URL;
  }

  async getCount(): Promise<ArcGISResponse<ArcGISCountAttrs>> {
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

  async getConfirmedPerHealthFacility(): Promise<
    ArcGISResponse<ArcGISConfirmedPerHealthFacilityAttrs>
  > {
    try {
      const response: string = await this.get(DATA_URLS.ARCGIS_CONFIRMED_PER_HEALTH_FACILITY);
      return sanitizeResponse(parseToJSON(response));
    } catch (error) {
      throw error;
    }
  }

  async getPUIsPerHealthFacility(): Promise<ArcGISResponse<ArcGISPUIPerHealthFacilityAttrs>> {
    try {
      const response: string = await this.get(DATA_URLS.ARCGIS_PUIs_PER_HEALTH_FACILITY);
      return sanitizeResponse(parseToJSON(response));
    } catch (error) {
      throw error;
    }
  }

  async getConfirmedPerResidence(): Promise<ArcGISResponse<ArcGISConfirmedPerResidenceAttrs>> {
    try {
      const response: string = await this.get(DATA_URLS.ARCGIS_CONFIRMED_PER_RESIDENCE);
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
