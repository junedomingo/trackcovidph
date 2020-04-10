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
      const response = await cachedRequest(this, ENDPOINTS.ARCGIS_COUNTS, 'counts');
      return sanitizeResponse(parseToJSON<ArcGISResponse<ArcGISCountAttrs>>(response.data));
    } catch (error) {
      throw error;
    }
  }

  async getConfirmedLocals(): Promise<ArcGISResponse<ArcGISConfirmedLocalAttrs>> {
    const cacheKey = 'confirmed_locals';
    try {
      if (!isDummy()) {
        const dummyFilePath = 'dummyData/DummyDataConfirmedLocals.json';
        const response = await cachedRequest(this, dummyFilePath, cacheKey, true);
        return sanitizeResponse(parseToJSON(response.data));
      }
      const response = await cachedRequest(this, ENDPOINTS.ARCGIS_CONFIRMED_LOCALS, cacheKey);
      return sanitizeResponse(parseToJSON(response.data));
    } catch (error) {
      throw error;
    }
  }

  async getConfirmedPerHealthFacility(): Promise<
    ArcGISResponse<ArcGISConfirmedPerHealthFacilityAttrs>
  > {
    try {
      const response = await cachedRequest(
        this,
        ENDPOINTS.ARCGIS_CONFIRMED_PER_HEALTH_FACILITY,
        'confirmed_per_health_facility'
      );
      return sanitizeResponse(parseToJSON(response.data));
    } catch (error) {
      throw error;
    }
  }

  async getPUIsPerHealthFacility(): Promise<ArcGISResponse<ArcGISPUIPerHealthFacilityAttrs>> {
    try {
      const response = await cachedRequest(
        this,
        ENDPOINTS.ARCGIS_PUIS_PER_HEALTH_FACILITY,
        'puis_per_health_facility'
      );
      return sanitizeResponse(parseToJSON(response.data));
    } catch (error) {
      throw error;
    }
  }

  async getConfirmedPerResidence(): Promise<ArcGISResponse<ArcGISConfirmedPerResidenceAttrs>> {
    try {
      const response = await cachedRequest(
        this,
        ENDPOINTS.ARCGIS_CONFIRMED_PER_RESIDENCE,
        'confirmed_per_residence'
      );
      return sanitizeResponse(parseToJSON(response.data));
    } catch (error) {
      throw error;
    }
  }

  async getConfirmedOFWs(): Promise<ArcGISResponse<ArcGISConfirmedOFWAttrs>> {
    try {
      const response = await cachedRequest(this, ENDPOINTS.ARCGIS_CONFIRMED_OFWS, 'confirmed_ofws');
      return sanitizeResponse(parseToJSON(response.data));
    } catch (error) {
      throw error;
    }
  }

  async getConfirmedForeignNationals(): Promise<
    ArcGISResponse<ArcGISConfirmedForeignNationalAttrs>
  > {
    try {
      const response = await cachedRequest(
        this,
        ENDPOINTS.ARCGIS_CONFIRMED_FOREIGN_NATIONALS,
        'confirmed_foreign_nationals'
      );
      return sanitizeResponse(parseToJSON(response.data));
    } catch (error) {
      throw error;
    }
  }
}
