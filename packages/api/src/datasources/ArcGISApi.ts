import { RESTDataSource } from 'apollo-datasource-rest';

import { ENDPOINTS } from '../conts';
import {
  ArcGISConfirmedPerHealthFacilityAttrs,
  ArcGISConfirmedPerResidenceAttrs,
  ArcGISConfirmedForeignNationalAttrs,
  ArcGISConfirmedLocalAttrs,
  ArcGISConfirmedOFWAttrs,
  ArcGISCountAttrs,
  ArcGISPUIPerHealthFacilityAttrs,
  ArcGISResponse,
} from '../types/interfaces';
import { parseToJSON, sanitizeResponse, isDummy } from '../utils';
import { cachedRequest } from './cachedRequest';

export class ArcGISApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = ENDPOINTS.ARCGIS_BASE_URL;
  }

  async getCounts(): Promise<ArcGISResponse<ArcGISCountAttrs>> {
    try {
      const response = await cachedRequest(this, ENDPOINTS.ARCGIS_COUNTS);
      return sanitizeResponse(parseToJSON(response.data));
    } catch (error) {
      throw error;
    }
  }

  async getConfirmedLocals(): Promise<ArcGISResponse<ArcGISConfirmedLocalAttrs>> {
    try {
      if (isDummy()) {
        const dummyFilePath = 'dummyData/DummyDataConfirmedLocals.json';
        const response = await cachedRequest(this, dummyFilePath, true);
        return sanitizeResponse(parseToJSON(response.data));
      }
      const response = await cachedRequest(this, ENDPOINTS.ARCGIS_CONFIRMED_LOCALS);
      return sanitizeResponse(parseToJSON(response.data));
    } catch (error) {
      throw error;
    }
  }

  async getConfirmedPerHealthFacility(): Promise<
    ArcGISResponse<ArcGISConfirmedPerHealthFacilityAttrs>
  > {
    try {
      const response = await cachedRequest(this, ENDPOINTS.ARCGIS_CONFIRMED_PER_HEALTH_FACILITY);
      return sanitizeResponse(parseToJSON(response.data));
    } catch (error) {
      throw error;
    }
  }

  async getPUIsPerHealthFacility(): Promise<ArcGISResponse<ArcGISPUIPerHealthFacilityAttrs>> {
    try {
      const response = await cachedRequest(this, ENDPOINTS.ARCGIS_PUIs_PER_HEALTH_FACILITY);
      return sanitizeResponse(parseToJSON(response.data));
    } catch (error) {
      throw error;
    }
  }

  async getConfirmedPerResidence(): Promise<ArcGISResponse<ArcGISConfirmedPerResidenceAttrs>> {
    try {
      const response = await cachedRequest(this, ENDPOINTS.ARCGIS_CONFIRMED_PER_RESIDENCE);
      return sanitizeResponse(parseToJSON(response.data));
    } catch (error) {
      throw error;
    }
  }

  async getConfirmedOFWs(): Promise<ArcGISResponse<ArcGISConfirmedOFWAttrs>> {
    try {
      const response = await cachedRequest(this, ENDPOINTS.ARCGIS_CONFIRMED_OFWs);
      return sanitizeResponse(parseToJSON(response.data));
    } catch (error) {
      throw error;
    }
  }

  async getConfirmedForeignNationals(): Promise<
    ArcGISResponse<ArcGISConfirmedForeignNationalAttrs>
  > {
    try {
      const response = await cachedRequest(this, ENDPOINTS.ARCGIS_CONFIRMED_FOREIGN_NATIONALS);
      return sanitizeResponse(parseToJSON(response.data));
    } catch (error) {
      throw error;
    }
  }
}
