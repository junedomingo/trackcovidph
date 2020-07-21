import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';

import { Patient } from '../types/graphql';
import { toDate, toAge, toNationality, toSymptoms, toTravelHistory } from '../utils';
import { AppContext, ArcGISConfirmedLocalAttrs } from '../types/interfaces';
import { getPatients } from './utils/getPatients';
import { rateLimit } from '../middlewares';

@Resolver(() => Patient)
export class ConfirmedLocalResolver {
  @UseMiddleware(rateLimit())
  @Query(() => [Patient])
  async confirmedLocals(@Ctx() { dataSources }: AppContext): Promise<Patient[]> {
    const { features } = await dataSources.ArcGISApi.getConfirmedLocals();

    const patientsAsParam = features.map(
      ({ attributes: attrs }: ArcGISConfirmedLocalAttrs): Patient => ({
        id: attrs.sequ,
        case_id: attrs.PH_masterl,
        date_confirmed: toDate(attrs.confirmed),
        date_reported: toDate(attrs.petsa),
        age: toAge(attrs.edad),
        sex: attrs.kasarian,
        status: attrs.status,
        residence: attrs.residence,
        travel_history: toTravelHistory(attrs.travel_hx),
        nationality: toNationality(attrs.nationalit),
        facility: {
          name: attrs.facility,
          coordinates: {
            lat: attrs.latitude,
            lng: attrs.longitude,
          },
        },
        symptoms: toSymptoms(attrs.symptoms),
        strToParse: [attrs.travel_hx],
      })
    );

    const patients = await getPatients(patientsAsParam);

    return patients;
  }
}
