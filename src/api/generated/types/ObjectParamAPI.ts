import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions } from '../configuration';
import type { Middleware } from '../middleware';

import { AirconSettingsResponse } from '../models/AirconSettingsResponse';
import { ApplianceModelAndParam } from '../models/ApplianceModelAndParam';
import { ApplianceModelAndParamModel } from '../models/ApplianceModelAndParamModel';
import { ApplianceModelAndParamParams } from '../models/ApplianceModelAndParamParams';
import { ApplianceResponse } from '../models/ApplianceResponse';
import { ApplianceResponseAircon } from '../models/ApplianceResponseAircon';
import { ApplianceResponseAirconRange } from '../models/ApplianceResponseAirconRange';
import { ApplianceResponseAirconRangeModesValue } from '../models/ApplianceResponseAirconRangeModesValue';
import { ApplianceResponseAirconSmartEcoMode } from '../models/ApplianceResponseAirconSmartEcoMode';
import { ApplianceResponseBle } from '../models/ApplianceResponseBle';
import { ApplianceResponseBleMacrosValue } from '../models/ApplianceResponseBleMacrosValue';
import { ApplianceResponseBleSesame } from '../models/ApplianceResponseBleSesame';
import { ApplianceResponseDevice } from '../models/ApplianceResponseDevice';
import { ApplianceResponseEchonetlite } from '../models/ApplianceResponseEchonetlite';
import { ApplianceResponseEchonetliteGetPropertiesValue } from '../models/ApplianceResponseEchonetliteGetPropertiesValue';
import { ApplianceResponseEchonetliteLocalize } from '../models/ApplianceResponseEchonetliteLocalize';
import { ApplianceResponseEchonetliteLocalizePropertiesValue } from '../models/ApplianceResponseEchonetliteLocalizePropertiesValue';
import { ApplianceResponseEchonetliteLocalizePropertiesValueEnumValue } from '../models/ApplianceResponseEchonetliteLocalizePropertiesValueEnumValue';
import { ApplianceResponseLight } from '../models/ApplianceResponseLight';
import { ApplianceResponseLightButtonsInner } from '../models/ApplianceResponseLightButtonsInner';
import { ApplianceResponseLightProjector } from '../models/ApplianceResponseLightProjector';
import { ApplianceResponseLightProjectorLayout } from '../models/ApplianceResponseLightProjectorLayout';
import { ApplianceResponseLightProjectorLayoutTemplatesInner } from '../models/ApplianceResponseLightProjectorLayoutTemplatesInner';
import { ApplianceResponseLightState } from '../models/ApplianceResponseLightState';
import { ApplianceResponseMorninPlus } from '../models/ApplianceResponseMorninPlus';
import { ApplianceResponseMorninPlusDevicesInner } from '../models/ApplianceResponseMorninPlusDevicesInner';
import { ApplianceResponseQrioLock } from '../models/ApplianceResponseQrioLock';
import { ApplianceResponseQrioLockDevice } from '../models/ApplianceResponseQrioLockDevice';
import { ApplianceResponseSettings } from '../models/ApplianceResponseSettings';
import { ApplianceResponseSignalsInner } from '../models/ApplianceResponseSignalsInner';
import { ApplianceResponseSmartMeter } from '../models/ApplianceResponseSmartMeter';
import { ApplianceResponseSmartMeterEchonetlitePropertiesInner } from '../models/ApplianceResponseSmartMeterEchonetlitePropertiesInner';
import { ApplianceResponseTv } from '../models/ApplianceResponseTv';
import { ApplianceResponseTvLayoutInner } from '../models/ApplianceResponseTvLayoutInner';
import { ApplianceResponseTvState } from '../models/ApplianceResponseTvState';
import { BLEPrivateMacroResponse } from '../models/BLEPrivateMacroResponse';
import { DeviceResponse } from '../models/DeviceResponse';
import { DeviceResponseNewestEventsValue } from '../models/DeviceResponseNewestEventsValue';
import { DeviceResponseUsersInner } from '../models/DeviceResponseUsersInner';
import { EchonetLiteApplianceResponse } from '../models/EchonetLiteApplianceResponse';
import { EchonetLiteApplianceResponseAppliancesInner } from '../models/EchonetLiteApplianceResponseAppliancesInner';
import { EchonetLiteApplianceResponseAppliancesInnerPropertiesInner } from '../models/EchonetLiteApplianceResponseAppliancesInnerPropertiesInner';
import { HomeInvite } from '../models/HomeInvite';
import { HomeInviteHome } from '../models/HomeInviteHome';
import { HomeInviteUser } from '../models/HomeInviteUser';
import { HomeResponse } from '../models/HomeResponse';
import { HomeResponseLocation } from '../models/HomeResponseLocation';
import { HomeResponseTown } from '../models/HomeResponseTown';
import { HomeResponseUsersInner } from '../models/HomeResponseUsersInner';
import { LightState } from '../models/LightState';
import { Signal } from '../models/Signal';
import { TVState } from '../models/TVState';
import { Template } from '../models/Template';
import { UserAndRole } from '../models/UserAndRole';
import { UserResponse } from '../models/UserResponse';
import { UserResponseUpdatedPrivacyPolicy } from '../models/UserResponseUpdatedPrivacyPolicy';
import { UserResponseUpdatedPrivacyPolicyLinksValue } from '../models/UserResponseUpdatedPrivacyPolicyLinksValue';

import { ObservableDefaultApi } from './ObservableAPI';
import { DefaultApiRequestFactory, DefaultApiResponseProcessor } from '../apis/DefaultApi';

export interface DefaultApi1applianceOrdersPostRequest {
  /**
   * List of all appliance IDs, comma separated.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1applianceOrdersPost
   */
  appliances?: string;
}

export interface DefaultApi1appliancesApplianceidAirconSettingsPostRequest {
  /**
   * Appliance Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidAirconSettingsPost
   */
  applianceid: string;
  /**
   * AC air direction. Empty means automatic.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidAirconSettingsPost
   */
  airDirection?: string;
  /**
   * AC horizontal air direction.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidAirconSettingsPost
   */
  airDirectionH?: string;
  /**
   * AC air volume. Empty means automatic. Numbers express the amount of volume. The range of AirVolumes which the air conditioner accepts depends on the air conditioner model and operation mode. Check the \\\&#39;AirConRangeMode\\\&#39; information in the response for the range of the particular air conditioner model and operation mode.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidAirconSettingsPost
   */
  airVolume?: string;
  /**
   * Button. Specify \\\&#39;power-off\\\&#39; always if you want the air conditioner powered off. Empty means powered on.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidAirconSettingsPost
   */
  button?: string;
  /**
   * AC operation mode. The range of operation modes which the air conditioner accepts depends on the air conditioner model. Check the \\\&#39;AirConRangeMode\\\&#39; information in the response for the range of the particular air conditioner model.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidAirconSettingsPost
   */
  operationMode?: string;
  /**
   * Temperature. The temperature in string format. The unit is described in Aircon object. The range of Temperatures which the air conditioner accepts depends on the air conditioner model and operation mode. Check the \\\&#39;AirConRangeMode\\\&#39; information in the response for the range of the particular air conditioner model and operation mode.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidAirconSettingsPost
   */
  temperature?: string;
  /**
   * Temperature unit. \\\&#39;c\\\&#39; or \\\&#39;f\\\&#39; or \\\&#39;\\\&#39; for unknown.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidAirconSettingsPost
   */
  temperatureUnit?: string;
}

export interface DefaultApi1appliancesApplianceidDeletePostRequest {
  /**
   * Appliance Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidDeletePost
   */
  applianceid: string;
}

export interface DefaultApi1appliancesApplianceidLightPostRequest {
  /**
   * Appliance Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidLightPost
   */
  applianceid: string;
  /**
   * Button name.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidLightPost
   */
  button?: string;
}

export interface DefaultApi1appliancesApplianceidLightProjectorPostRequest {
  /**
   * Appliance Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidLightProjectorPost
   */
  applianceid: string;
  /**
   * Button name.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidLightProjectorPost
   */
  button?: string;
}

export interface DefaultApi1appliancesApplianceidPostRequest {
  /**
   * Appliance Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidPost
   */
  applianceid: string;
  /**
   * Basename of the image file included in the app. Ex: \\\&#39;ico_ac_1\\\&#39;.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidPost
   */
  image?: string;
  /**
   * Appliance name.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidPost
   */
  nickname?: string;
}

export interface DefaultApi1appliancesApplianceidSesameBotClickPostRequest {
  /**
   * Appliance Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidSesameBotClickPost
   */
  applianceid: string;
}

export interface DefaultApi1appliancesApplianceidSignalOrdersPostRequest {
  /**
   * Appliance Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidSignalOrdersPost
   */
  applianceid: string;
  /**
   * List of all signal IDs, comma separated.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidSignalOrdersPost
   */
  signals?: string;
}

export interface DefaultApi1appliancesApplianceidSignalsGetRequest {
  /**
   * Appliance Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidSignalsGet
   */
  applianceid: string;
}

export interface DefaultApi1appliancesApplianceidSignalsPostRequest {
  /**
   * Appliance Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidSignalsPost
   */
  applianceid: string;
  /**
   * Basename of the image file included in the app. Ex: \\\&#39;ico_io\\\&#39;.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidSignalsPost
   */
  image?: string;
  /**
   * JSON serialized object describing infrared signals. Includes \\\&#39;data\\\&#39;, \\\&#39;freq\\\&#39; and \\\&#39;format\\\&#39; keys.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidSignalsPost
   */
  message?: string;
  /**
   * Signal name.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidSignalsPost
   */
  name?: string;
}

export interface DefaultApi1appliancesApplianceidTvPostRequest {
  /**
   * Appliance Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidTvPost
   */
  applianceid: string;
  /**
   * Button name.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesApplianceidTvPost
   */
  button?: string;
}

export interface DefaultApi1appliancesGetRequest {}

export interface DefaultApi1appliancesPostRequest {
  /**
   *
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesPost
   */
  device?: string;
  /**
   * Basename of the image file included in the app. Ex: \\\&#39;ico_ac_1\\\&#39;.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesPost
   */
  image?: string;
  /**
   * ApplianceModel ID if the appliance we\\\&#39;re trying to create is included in IRDB.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesPost
   */
  model?: string;
  /**
   * Enum of \\\&#39;AC\\\&#39;, \\\&#39;TV\\\&#39;, \\\&#39;Light\\\&#39;
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesPost
   */
  modelType?: string;
  /**
   * Appliance name.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1appliancesPost
   */
  nickname?: string;
}

export interface DefaultApi1bleAppliancesApplianceidPrivateMacrosGetRequest {
  /**
   * Appliance Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1bleAppliancesApplianceidPrivateMacrosGet
   */
  applianceid: string;
}

export interface DefaultApi1blePrivateMacrosPrivatemacroidExecPostRequest {
  /**
   * BLE Private Macro ID
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1blePrivateMacrosPrivatemacroidExecPost
   */
  privatemacroid: string;
}

export interface DefaultApi1detectappliancePostRequest {
  /**
   *
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1detectappliancePost
   */
  device?: string;
  /**
   * JSON serialized object describing infrared signals. Includes \\\&#39;data\\\&#39;, \\\&#39;freq\\\&#39; and \\\&#39;format\\\&#39; keys.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1detectappliancePost
   */
  message?: string;
}

export interface DefaultApi1devicesDeviceidAppliancesGetRequest {
  /**
   * Device Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1devicesDeviceidAppliancesGet
   */
  deviceid: string;
}

export interface DefaultApi1devicesDeviceidDeletePostRequest {
  /**
   * Device Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1devicesDeviceidDeletePost
   */
  deviceid: string;
}

export interface DefaultApi1devicesDeviceidHumidityOffsetPostRequest {
  /**
   * Device Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1devicesDeviceidHumidityOffsetPost
   */
  deviceid: string;
  /**
   * Humidity offset value added to the measured humidity.
   * Defaults to: undefined
   * @type number
   * @memberof DefaultApi_1devicesDeviceidHumidityOffsetPost
   */
  offset?: number;
}

export interface DefaultApi1devicesDeviceidPostRequest {
  /**
   * Device Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1devicesDeviceidPost
   */
  deviceid: string;
  /**
   *
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1devicesDeviceidPost
   */
  name?: string;
}

export interface DefaultApi1devicesDeviceidTemperatureOffsetPostRequest {
  /**
   * Device Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1devicesDeviceidTemperatureOffsetPost
   */
  deviceid: string;
  /**
   * Temperature offset value added to the measured temperature.
   * Defaults to: undefined
   * @type number
   * @memberof DefaultApi_1devicesDeviceidTemperatureOffsetPost
   */
  offset?: number;
}

export interface DefaultApi1devicesGetRequest {}

export interface DefaultApi1echonetliteAppliancesApplianceidRefreshPostRequest {
  /**
   * Appliance Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1echonetliteAppliancesApplianceidRefreshPost
   */
  applianceid: string;
  /**
   * Comma separated EPCs in hex. eg: cf,da
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1echonetliteAppliancesApplianceidRefreshPost
   */
  epc?: string;
}

export interface DefaultApi1echonetliteAppliancesApplianceidSetPostRequest {
  /**
   * Appliance Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1echonetliteAppliancesApplianceidSetPost
   */
  applianceid: string;
  /**
   * EPC in hex string. eg: cf
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1echonetliteAppliancesApplianceidSetPost
   */
  epc?: string;
  /**
   * Value in hex string. String length must be 2x the number of bytes according to ECHONET Lite spec, and filled with zero if necessary. eg: 000000FF
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1echonetliteAppliancesApplianceidSetPost
   */
  val?: string;
}

export interface DefaultApi1echonetliteAppliancesGetRequest {}

export interface DefaultApi1homesGetRequest {}

export interface DefaultApi1homesHomeidDeletePostRequest {
  /**
   * Home Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1homesHomeidDeletePost
   */
  homeid: string;
}

export interface DefaultApi1homesHomeidDevicesGetRequest {
  /**
   * Home Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1homesHomeidDevicesGet
   */
  homeid: string;
}

export interface DefaultApi1homesHomeidInvitesPostRequest {
  /**
   * Home Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1homesHomeidInvitesPost
   */
  homeid: string;
}

export interface DefaultApi1homesHomeidKickPostRequest {
  /**
   * Home Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1homesHomeidKickPost
   */
  homeid: string;
  /**
   *
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1homesHomeidKickPost
   */
  user?: string;
}

export interface DefaultApi1homesHomeidLocationDeletePostRequest {
  /**
   * Home Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1homesHomeidLocationDeletePost
   */
  homeid: string;
}

export interface DefaultApi1homesHomeidLocationPostRequest {
  /**
   * Home Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1homesHomeidLocationPost
   */
  homeid: string;
}

export interface DefaultApi1homesHomeidLocationStateUpdatePostRequest {
  /**
   * Home Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1homesHomeidLocationStateUpdatePost
   */
  homeid: string;
}

export interface DefaultApi1homesHomeidOwnerPostRequest {
  /**
   * Home Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1homesHomeidOwnerPost
   */
  homeid: string;
  /**
   *
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1homesHomeidOwnerPost
   */
  user?: string;
}

export interface DefaultApi1homesHomeidPartPostRequest {
  /**
   * Home Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1homesHomeidPartPost
   */
  homeid: string;
}

export interface DefaultApi1homesHomeidPostRequest {
  /**
   * Home Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1homesHomeidPost
   */
  homeid: string;
  /**
   *
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1homesHomeidPost
   */
  name?: string;
}

export interface DefaultApi1homesHomeidTransferTohomeidPostRequest {
  /**
   * Home Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1homesHomeidTransferTohomeidPost
   */
  homeid: string;
  /**
   * Transfer to Home Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1homesHomeidTransferTohomeidPost
   */
  tohomeid: string;
  /**
   *
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1homesHomeidTransferTohomeidPost
   */
  devices?: string;
}

export interface DefaultApi1homesHomeidUsersGetRequest {
  /**
   * Home Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1homesHomeidUsersGet
   */
  homeid: string;
}

export interface DefaultApi1homesPostRequest {
  /**
   *
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1homesPost
   */
  name?: string;
}

export interface DefaultApi1invitesInvitetokenGetRequest {
  /**
   * Invite Token
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1invitesInvitetokenGet
   */
  invitetoken: string;
}

export interface DefaultApi1invitesInvitetokenPostRequest {
  /**
   * Invite Token
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1invitesInvitetokenPost
   */
  invitetoken: string;
}

export interface DefaultApi1signalsSignalidDeletePostRequest {
  /**
   * Signal Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1signalsSignalidDeletePost
   */
  signalid: string;
}

export interface DefaultApi1signalsSignalidPostRequest {
  /**
   * Signal Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1signalsSignalidPost
   */
  signalid: string;
  /**
   * Basename of the image file included in the app. Ex: \\\&#39;ico_io\\\&#39;.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1signalsSignalidPost
   */
  image?: string;
  /**
   * Signal name.
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1signalsSignalidPost
   */
  name?: string;
}

export interface DefaultApi1signalsSignalidSendPostRequest {
  /**
   * Signal Id
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1signalsSignalidSendPost
   */
  signalid: string;
}

export interface DefaultApi1usersMeGetRequest {}

export interface DefaultApi1usersMePostRequest {
  /**
   *
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1usersMePost
   */
  country?: string;
  /**
   *
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1usersMePost
   */
  distanceUnit?: string;
  /**
   *
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1usersMePost
   */
  nickname?: string;
  /**
   *
   * Defaults to: undefined
   * @type string
   * @memberof DefaultApi_1usersMePost
   */
  tempUnit?: string;
}

export class ObjectDefaultApi {
  private api: ObservableDefaultApi;

  public constructor(
    configuration: Configuration,
    requestFactory?: DefaultApiRequestFactory,
    responseProcessor?: DefaultApiResponseProcessor
  ) {
    this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
  }

  /**
   * Reorder appliances. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1applianceOrdersPostWithHttpInfo(
    param: DefaultApi1applianceOrdersPostRequest = {},
    options?: ConfigurationOptions
  ): Promise<HttpInfo<any>> {
    return this.api._1applianceOrdersPostWithHttpInfo(param.appliances, options).toPromise();
  }

  /**
   * Reorder appliances. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1applianceOrdersPost(
    param: DefaultApi1applianceOrdersPostRequest = {},
    options?: ConfigurationOptions
  ): Promise<any> {
    return this.api._1applianceOrdersPost(param.appliances, options).toPromise();
  }

  /**
   * Update air conditioner settings. Requires sendir OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesApplianceidAirconSettingsPostWithHttpInfo(
    param: DefaultApi1appliancesApplianceidAirconSettingsPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<AirconSettingsResponse>> {
    return this.api
      ._1appliancesApplianceidAirconSettingsPostWithHttpInfo(
        param.applianceid,
        param.airDirection,
        param.airDirectionH,
        param.airVolume,
        param.button,
        param.operationMode,
        param.temperature,
        param.temperatureUnit,
        options
      )
      .toPromise();
  }

  /**
   * Update air conditioner settings. Requires sendir OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesApplianceidAirconSettingsPost(
    param: DefaultApi1appliancesApplianceidAirconSettingsPostRequest,
    options?: ConfigurationOptions
  ): Promise<AirconSettingsResponse> {
    return this.api
      ._1appliancesApplianceidAirconSettingsPost(
        param.applianceid,
        param.airDirection,
        param.airDirectionH,
        param.airVolume,
        param.button,
        param.operationMode,
        param.temperature,
        param.temperatureUnit,
        options
      )
      .toPromise();
  }

  /**
   * Delete an appliance. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesApplianceidDeletePostWithHttpInfo(
    param: DefaultApi1appliancesApplianceidDeletePostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<any>> {
    return this.api
      ._1appliancesApplianceidDeletePostWithHttpInfo(param.applianceid, options)
      .toPromise();
  }

  /**
   * Delete an appliance. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesApplianceidDeletePost(
    param: DefaultApi1appliancesApplianceidDeletePostRequest,
    options?: ConfigurationOptions
  ): Promise<any> {
    return this.api._1appliancesApplianceidDeletePost(param.applianceid, options).toPromise();
  }

  /**
   * Send light signal. Requires sendir OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesApplianceidLightPostWithHttpInfo(
    param: DefaultApi1appliancesApplianceidLightPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<LightState>> {
    return this.api
      ._1appliancesApplianceidLightPostWithHttpInfo(param.applianceid, param.button, options)
      .toPromise();
  }

  /**
   * Send light signal. Requires sendir OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesApplianceidLightPost(
    param: DefaultApi1appliancesApplianceidLightPostRequest,
    options?: ConfigurationOptions
  ): Promise<LightState> {
    return this.api
      ._1appliancesApplianceidLightPost(param.applianceid, param.button, options)
      .toPromise();
  }

  /**
   * Send light_projector signal. Requires sendir OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesApplianceidLightProjectorPostWithHttpInfo(
    param: DefaultApi1appliancesApplianceidLightProjectorPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<any>> {
    return this.api
      ._1appliancesApplianceidLightProjectorPostWithHttpInfo(
        param.applianceid,
        param.button,
        options
      )
      .toPromise();
  }

  /**
   * Send light_projector signal. Requires sendir OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesApplianceidLightProjectorPost(
    param: DefaultApi1appliancesApplianceidLightProjectorPostRequest,
    options?: ConfigurationOptions
  ): Promise<any> {
    return this.api
      ._1appliancesApplianceidLightProjectorPost(param.applianceid, param.button, options)
      .toPromise();
  }

  /**
   * Update an appliance. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesApplianceidPostWithHttpInfo(
    param: DefaultApi1appliancesApplianceidPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<ApplianceResponse>> {
    return this.api
      ._1appliancesApplianceidPostWithHttpInfo(
        param.applianceid,
        param.image,
        param.nickname,
        options
      )
      .toPromise();
  }

  /**
   * Update an appliance. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesApplianceidPost(
    param: DefaultApi1appliancesApplianceidPostRequest,
    options?: ConfigurationOptions
  ): Promise<ApplianceResponse> {
    return this.api
      ._1appliancesApplianceidPost(param.applianceid, param.image, param.nickname, options)
      .toPromise();
  }

  /**
   * Send SESAME bot click request. Requires sendir OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesApplianceidSesameBotClickPostWithHttpInfo(
    param: DefaultApi1appliancesApplianceidSesameBotClickPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<any>> {
    return this.api
      ._1appliancesApplianceidSesameBotClickPostWithHttpInfo(param.applianceid, options)
      .toPromise();
  }

  /**
   * Send SESAME bot click request. Requires sendir OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesApplianceidSesameBotClickPost(
    param: DefaultApi1appliancesApplianceidSesameBotClickPostRequest,
    options?: ConfigurationOptions
  ): Promise<any> {
    return this.api
      ._1appliancesApplianceidSesameBotClickPost(param.applianceid, options)
      .toPromise();
  }

  /**
   * Reorder signals. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesApplianceidSignalOrdersPostWithHttpInfo(
    param: DefaultApi1appliancesApplianceidSignalOrdersPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<any>> {
    return this.api
      ._1appliancesApplianceidSignalOrdersPostWithHttpInfo(
        param.applianceid,
        param.signals,
        options
      )
      .toPromise();
  }

  /**
   * Reorder signals. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesApplianceidSignalOrdersPost(
    param: DefaultApi1appliancesApplianceidSignalOrdersPostRequest,
    options?: ConfigurationOptions
  ): Promise<any> {
    return this.api
      ._1appliancesApplianceidSignalOrdersPost(param.applianceid, param.signals, options)
      .toPromise();
  }

  /**
   * Fetch the list of signals. Requires basic.read OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesApplianceidSignalsGetWithHttpInfo(
    param: DefaultApi1appliancesApplianceidSignalsGetRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<Array<Signal>>> {
    return this.api
      ._1appliancesApplianceidSignalsGetWithHttpInfo(param.applianceid, options)
      .toPromise();
  }

  /**
   * Fetch the list of signals. Requires basic.read OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesApplianceidSignalsGet(
    param: DefaultApi1appliancesApplianceidSignalsGetRequest,
    options?: ConfigurationOptions
  ): Promise<Array<Signal>> {
    return this.api._1appliancesApplianceidSignalsGet(param.applianceid, options).toPromise();
  }

  /**
   * Create a new signal. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesApplianceidSignalsPostWithHttpInfo(
    param: DefaultApi1appliancesApplianceidSignalsPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<Signal>> {
    return this.api
      ._1appliancesApplianceidSignalsPostWithHttpInfo(
        param.applianceid,
        param.image,
        param.message,
        param.name,
        options
      )
      .toPromise();
  }

  /**
   * Create a new signal. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesApplianceidSignalsPost(
    param: DefaultApi1appliancesApplianceidSignalsPostRequest,
    options?: ConfigurationOptions
  ): Promise<Signal> {
    return this.api
      ._1appliancesApplianceidSignalsPost(
        param.applianceid,
        param.image,
        param.message,
        param.name,
        options
      )
      .toPromise();
  }

  /**
   * Send TV signal. Requires sendir OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesApplianceidTvPostWithHttpInfo(
    param: DefaultApi1appliancesApplianceidTvPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<TVState>> {
    return this.api
      ._1appliancesApplianceidTvPostWithHttpInfo(param.applianceid, param.button, options)
      .toPromise();
  }

  /**
   * Send TV signal. Requires sendir OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesApplianceidTvPost(
    param: DefaultApi1appliancesApplianceidTvPostRequest,
    options?: ConfigurationOptions
  ): Promise<TVState> {
    return this.api
      ._1appliancesApplianceidTvPost(param.applianceid, param.button, options)
      .toPromise();
  }

  /**
   * Fetch the list of appliances. Requires basic.read OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesGetWithHttpInfo(
    param: DefaultApi1appliancesGetRequest = {},
    options?: ConfigurationOptions
  ): Promise<HttpInfo<Array<ApplianceResponse>>> {
    return this.api._1appliancesGetWithHttpInfo(options).toPromise();
  }

  /**
   * Fetch the list of appliances. Requires basic.read OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesGet(
    param: DefaultApi1appliancesGetRequest = {},
    options?: ConfigurationOptions
  ): Promise<Array<ApplianceResponse>> {
    return this.api._1appliancesGet(options).toPromise();
  }

  /**
   * Create a new appliance. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesPostWithHttpInfo(
    param: DefaultApi1appliancesPostRequest = {},
    options?: ConfigurationOptions
  ): Promise<HttpInfo<ApplianceResponse>> {
    return this.api
      ._1appliancesPostWithHttpInfo(
        param.device,
        param.image,
        param.model,
        param.modelType,
        param.nickname,
        options
      )
      .toPromise();
  }

  /**
   * Create a new appliance. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1appliancesPost(
    param: DefaultApi1appliancesPostRequest = {},
    options?: ConfigurationOptions
  ): Promise<ApplianceResponse> {
    return this.api
      ._1appliancesPost(
        param.device,
        param.image,
        param.model,
        param.modelType,
        param.nickname,
        options
      )
      .toPromise();
  }

  /**
   * Fetch the list of ble_private_macros. Requires basic.read OAuth2 scopes.
   * @param param the request object
   */
  public _1bleAppliancesApplianceidPrivateMacrosGetWithHttpInfo(
    param: DefaultApi1bleAppliancesApplianceidPrivateMacrosGetRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<Array<BLEPrivateMacroResponse>>> {
    return this.api
      ._1bleAppliancesApplianceidPrivateMacrosGetWithHttpInfo(param.applianceid, options)
      .toPromise();
  }

  /**
   * Fetch the list of ble_private_macros. Requires basic.read OAuth2 scopes.
   * @param param the request object
   */
  public _1bleAppliancesApplianceidPrivateMacrosGet(
    param: DefaultApi1bleAppliancesApplianceidPrivateMacrosGetRequest,
    options?: ConfigurationOptions
  ): Promise<Array<BLEPrivateMacroResponse>> {
    return this.api
      ._1bleAppliancesApplianceidPrivateMacrosGet(param.applianceid, options)
      .toPromise();
  }

  /**
   * Send BLE Private Macro control request. Requires sendir OAuth2 scopes.
   * @param param the request object
   */
  public _1blePrivateMacrosPrivatemacroidExecPostWithHttpInfo(
    param: DefaultApi1blePrivateMacrosPrivatemacroidExecPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<any>> {
    return this.api
      ._1blePrivateMacrosPrivatemacroidExecPostWithHttpInfo(param.privatemacroid, options)
      .toPromise();
  }

  /**
   * Send BLE Private Macro control request. Requires sendir OAuth2 scopes.
   * @param param the request object
   */
  public _1blePrivateMacrosPrivatemacroidExecPost(
    param: DefaultApi1blePrivateMacrosPrivatemacroidExecPostRequest,
    options?: ConfigurationOptions
  ): Promise<any> {
    return this.api
      ._1blePrivateMacrosPrivatemacroidExecPost(param.privatemacroid, options)
      .toPromise();
  }

  /**
   * Find the air conditioner best matching the provided infrared signal. Requires detectappliance OAuth2 scopes.
   * @param param the request object
   */
  public _1detectappliancePostWithHttpInfo(
    param: DefaultApi1detectappliancePostRequest = {},
    options?: ConfigurationOptions
  ): Promise<HttpInfo<Array<ApplianceModelAndParam>>> {
    return this.api
      ._1detectappliancePostWithHttpInfo(param.device, param.message, options)
      .toPromise();
  }

  /**
   * Find the air conditioner best matching the provided infrared signal. Requires detectappliance OAuth2 scopes.
   * @param param the request object
   */
  public _1detectappliancePost(
    param: DefaultApi1detectappliancePostRequest = {},
    options?: ConfigurationOptions
  ): Promise<Array<ApplianceModelAndParam>> {
    return this.api._1detectappliancePost(param.device, param.message, options).toPromise();
  }

  /**
   * Fetch the list of appliances registered to the Remo device. Requires basic.read OAuth2 scopes.
   * @param param the request object
   */
  public _1devicesDeviceidAppliancesGetWithHttpInfo(
    param: DefaultApi1devicesDeviceidAppliancesGetRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<Array<ApplianceResponse>>> {
    return this.api._1devicesDeviceidAppliancesGetWithHttpInfo(param.deviceid, options).toPromise();
  }

  /**
   * Fetch the list of appliances registered to the Remo device. Requires basic.read OAuth2 scopes.
   * @param param the request object
   */
  public _1devicesDeviceidAppliancesGet(
    param: DefaultApi1devicesDeviceidAppliancesGetRequest,
    options?: ConfigurationOptions
  ): Promise<Array<ApplianceResponse>> {
    return this.api._1devicesDeviceidAppliancesGet(param.deviceid, options).toPromise();
  }

  /**
   * Delete a device. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1devicesDeviceidDeletePostWithHttpInfo(
    param: DefaultApi1devicesDeviceidDeletePostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<any>> {
    return this.api._1devicesDeviceidDeletePostWithHttpInfo(param.deviceid, options).toPromise();
  }

  /**
   * Delete a device. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1devicesDeviceidDeletePost(
    param: DefaultApi1devicesDeviceidDeletePostRequest,
    options?: ConfigurationOptions
  ): Promise<any> {
    return this.api._1devicesDeviceidDeletePost(param.deviceid, options).toPromise();
  }

  /**
   * Update a device\'s humidity offset. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1devicesDeviceidHumidityOffsetPostWithHttpInfo(
    param: DefaultApi1devicesDeviceidHumidityOffsetPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<DeviceResponse>> {
    return this.api
      ._1devicesDeviceidHumidityOffsetPostWithHttpInfo(param.deviceid, param.offset, options)
      .toPromise();
  }

  /**
   * Update a device\'s humidity offset. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1devicesDeviceidHumidityOffsetPost(
    param: DefaultApi1devicesDeviceidHumidityOffsetPostRequest,
    options?: ConfigurationOptions
  ): Promise<DeviceResponse> {
    return this.api
      ._1devicesDeviceidHumidityOffsetPost(param.deviceid, param.offset, options)
      .toPromise();
  }

  /**
   * Update a device. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1devicesDeviceidPostWithHttpInfo(
    param: DefaultApi1devicesDeviceidPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<DeviceResponse>> {
    return this.api
      ._1devicesDeviceidPostWithHttpInfo(param.deviceid, param.name, options)
      .toPromise();
  }

  /**
   * Update a device. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1devicesDeviceidPost(
    param: DefaultApi1devicesDeviceidPostRequest,
    options?: ConfigurationOptions
  ): Promise<DeviceResponse> {
    return this.api._1devicesDeviceidPost(param.deviceid, param.name, options).toPromise();
  }

  /**
   * Update a device\'s temperature offset. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1devicesDeviceidTemperatureOffsetPostWithHttpInfo(
    param: DefaultApi1devicesDeviceidTemperatureOffsetPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<DeviceResponse>> {
    return this.api
      ._1devicesDeviceidTemperatureOffsetPostWithHttpInfo(param.deviceid, param.offset, options)
      .toPromise();
  }

  /**
   * Update a device\'s temperature offset. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1devicesDeviceidTemperatureOffsetPost(
    param: DefaultApi1devicesDeviceidTemperatureOffsetPostRequest,
    options?: ConfigurationOptions
  ): Promise<DeviceResponse> {
    return this.api
      ._1devicesDeviceidTemperatureOffsetPost(param.deviceid, param.offset, options)
      .toPromise();
  }

  /**
   * Fetch the list of Remo devices. Requires basic.read OAuth2 scopes.
   * @param param the request object
   */
  public _1devicesGetWithHttpInfo(
    param: DefaultApi1devicesGetRequest = {},
    options?: ConfigurationOptions
  ): Promise<HttpInfo<Array<DeviceResponse>>> {
    return this.api._1devicesGetWithHttpInfo(options).toPromise();
  }

  /**
   * Fetch the list of Remo devices. Requires basic.read OAuth2 scopes.
   * @param param the request object
   */
  public _1devicesGet(
    param: DefaultApi1devicesGetRequest = {},
    options?: ConfigurationOptions
  ): Promise<Array<DeviceResponse>> {
    return this.api._1devicesGet(options).toPromise();
  }

  /**
   * Notify Remo E / Remo E lite to refresh one or more ECHONET Lite properties. This endpoint is subject to ECHONET Lite specific rate limiting. See the rate limiting section of the documentation for more details. Requires echonetlite.*.read OAuth2 scopes.
   * @param param the request object
   */
  public _1echonetliteAppliancesApplianceidRefreshPostWithHttpInfo(
    param: DefaultApi1echonetliteAppliancesApplianceidRefreshPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<any>> {
    return this.api
      ._1echonetliteAppliancesApplianceidRefreshPostWithHttpInfo(
        param.applianceid,
        param.epc,
        options
      )
      .toPromise();
  }

  /**
   * Notify Remo E / Remo E lite to refresh one or more ECHONET Lite properties. This endpoint is subject to ECHONET Lite specific rate limiting. See the rate limiting section of the documentation for more details. Requires echonetlite.*.read OAuth2 scopes.
   * @param param the request object
   */
  public _1echonetliteAppliancesApplianceidRefreshPost(
    param: DefaultApi1echonetliteAppliancesApplianceidRefreshPostRequest,
    options?: ConfigurationOptions
  ): Promise<any> {
    return this.api
      ._1echonetliteAppliancesApplianceidRefreshPost(param.applianceid, param.epc, options)
      .toPromise();
  }

  /**
   * Set one ECHONET Lite property. This endpoint is subject to ECHONET Lite specific rate limiting. See the rate limiting section of the documentation for more details. Requires echonetlite.*.write OAuth2 scopes.
   * @param param the request object
   */
  public _1echonetliteAppliancesApplianceidSetPostWithHttpInfo(
    param: DefaultApi1echonetliteAppliancesApplianceidSetPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<any>> {
    return this.api
      ._1echonetliteAppliancesApplianceidSetPostWithHttpInfo(
        param.applianceid,
        param.epc,
        param.val,
        options
      )
      .toPromise();
  }

  /**
   * Set one ECHONET Lite property. This endpoint is subject to ECHONET Lite specific rate limiting. See the rate limiting section of the documentation for more details. Requires echonetlite.*.write OAuth2 scopes.
   * @param param the request object
   */
  public _1echonetliteAppliancesApplianceidSetPost(
    param: DefaultApi1echonetliteAppliancesApplianceidSetPostRequest,
    options?: ConfigurationOptions
  ): Promise<any> {
    return this.api
      ._1echonetliteAppliancesApplianceidSetPost(param.applianceid, param.epc, param.val, options)
      .toPromise();
  }

  /**
   * Fetch the list of ECHONET Lite appliances. Requires basic.read OAuth2 scopes.
   * @param param the request object
   */
  public _1echonetliteAppliancesGetWithHttpInfo(
    param: DefaultApi1echonetliteAppliancesGetRequest = {},
    options?: ConfigurationOptions
  ): Promise<HttpInfo<EchonetLiteApplianceResponse>> {
    return this.api._1echonetliteAppliancesGetWithHttpInfo(options).toPromise();
  }

  /**
   * Fetch the list of ECHONET Lite appliances. Requires basic.read OAuth2 scopes.
   * @param param the request object
   */
  public _1echonetliteAppliancesGet(
    param: DefaultApi1echonetliteAppliancesGetRequest = {},
    options?: ConfigurationOptions
  ): Promise<EchonetLiteApplianceResponse> {
    return this.api._1echonetliteAppliancesGet(options).toPromise();
  }

  /**
   * Fetch the list of homes. Requires home.read OAuth2 scopes.
   * @param param the request object
   */
  public _1homesGetWithHttpInfo(
    param: DefaultApi1homesGetRequest = {},
    options?: ConfigurationOptions
  ): Promise<HttpInfo<Array<HomeResponse>>> {
    return this.api._1homesGetWithHttpInfo(options).toPromise();
  }

  /**
   * Fetch the list of homes. Requires home.read OAuth2 scopes.
   * @param param the request object
   */
  public _1homesGet(
    param: DefaultApi1homesGetRequest = {},
    options?: ConfigurationOptions
  ): Promise<Array<HomeResponse>> {
    return this.api._1homesGet(options).toPromise();
  }

  /**
   * Delete a home. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidDeletePostWithHttpInfo(
    param: DefaultApi1homesHomeidDeletePostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<any>> {
    return this.api._1homesHomeidDeletePostWithHttpInfo(param.homeid, options).toPromise();
  }

  /**
   * Delete a home. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidDeletePost(
    param: DefaultApi1homesHomeidDeletePostRequest,
    options?: ConfigurationOptions
  ): Promise<any> {
    return this.api._1homesHomeidDeletePost(param.homeid, options).toPromise();
  }

  /**
   * Fetch the list of devices in a home. Requires home.read OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidDevicesGetWithHttpInfo(
    param: DefaultApi1homesHomeidDevicesGetRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<Array<DeviceResponse>>> {
    return this.api._1homesHomeidDevicesGetWithHttpInfo(param.homeid, options).toPromise();
  }

  /**
   * Fetch the list of devices in a home. Requires home.read OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidDevicesGet(
    param: DefaultApi1homesHomeidDevicesGetRequest,
    options?: ConfigurationOptions
  ): Promise<Array<DeviceResponse>> {
    return this.api._1homesHomeidDevicesGet(param.homeid, options).toPromise();
  }

  /**
   * Create a new home invite. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidInvitesPostWithHttpInfo(
    param: DefaultApi1homesHomeidInvitesPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<HomeInvite>> {
    return this.api._1homesHomeidInvitesPostWithHttpInfo(param.homeid, options).toPromise();
  }

  /**
   * Create a new home invite. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidInvitesPost(
    param: DefaultApi1homesHomeidInvitesPostRequest,
    options?: ConfigurationOptions
  ): Promise<HomeInvite> {
    return this.api._1homesHomeidInvitesPost(param.homeid, options).toPromise();
  }

  /**
   * Kick a user from a home. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidKickPostWithHttpInfo(
    param: DefaultApi1homesHomeidKickPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<any>> {
    return this.api
      ._1homesHomeidKickPostWithHttpInfo(param.homeid, param.user, options)
      .toPromise();
  }

  /**
   * Kick a user from a home. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidKickPost(
    param: DefaultApi1homesHomeidKickPostRequest,
    options?: ConfigurationOptions
  ): Promise<any> {
    return this.api._1homesHomeidKickPost(param.homeid, param.user, options).toPromise();
  }

  /**
   * Delete a home\'s location. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidLocationDeletePostWithHttpInfo(
    param: DefaultApi1homesHomeidLocationDeletePostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<HomeResponse>> {
    return this.api._1homesHomeidLocationDeletePostWithHttpInfo(param.homeid, options).toPromise();
  }

  /**
   * Delete a home\'s location. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidLocationDeletePost(
    param: DefaultApi1homesHomeidLocationDeletePostRequest,
    options?: ConfigurationOptions
  ): Promise<HomeResponse> {
    return this.api._1homesHomeidLocationDeletePost(param.homeid, options).toPromise();
  }

  /**
   * Update a home\'s location. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidLocationPostWithHttpInfo(
    param: DefaultApi1homesHomeidLocationPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<HomeResponse>> {
    return this.api._1homesHomeidLocationPostWithHttpInfo(param.homeid, options).toPromise();
  }

  /**
   * Update a home\'s location. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidLocationPost(
    param: DefaultApi1homesHomeidLocationPostRequest,
    options?: ConfigurationOptions
  ): Promise<HomeResponse> {
    return this.api._1homesHomeidLocationPost(param.homeid, options).toPromise();
  }

  /**
   * Update the user\'s location state for a home. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidLocationStateUpdatePostWithHttpInfo(
    param: DefaultApi1homesHomeidLocationStateUpdatePostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<any>> {
    return this.api
      ._1homesHomeidLocationStateUpdatePostWithHttpInfo(param.homeid, options)
      .toPromise();
  }

  /**
   * Update the user\'s location state for a home. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidLocationStateUpdatePost(
    param: DefaultApi1homesHomeidLocationStateUpdatePostRequest,
    options?: ConfigurationOptions
  ): Promise<any> {
    return this.api._1homesHomeidLocationStateUpdatePost(param.homeid, options).toPromise();
  }

  /**
   * Change the owner of the home. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidOwnerPostWithHttpInfo(
    param: DefaultApi1homesHomeidOwnerPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<HomeResponse>> {
    return this.api
      ._1homesHomeidOwnerPostWithHttpInfo(param.homeid, param.user, options)
      .toPromise();
  }

  /**
   * Change the owner of the home. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidOwnerPost(
    param: DefaultApi1homesHomeidOwnerPostRequest,
    options?: ConfigurationOptions
  ): Promise<HomeResponse> {
    return this.api._1homesHomeidOwnerPost(param.homeid, param.user, options).toPromise();
  }

  /**
   * Part from a home. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidPartPostWithHttpInfo(
    param: DefaultApi1homesHomeidPartPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<any>> {
    return this.api._1homesHomeidPartPostWithHttpInfo(param.homeid, options).toPromise();
  }

  /**
   * Part from a home. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidPartPost(
    param: DefaultApi1homesHomeidPartPostRequest,
    options?: ConfigurationOptions
  ): Promise<any> {
    return this.api._1homesHomeidPartPost(param.homeid, options).toPromise();
  }

  /**
   * Update a home. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidPostWithHttpInfo(
    param: DefaultApi1homesHomeidPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<HomeResponse>> {
    return this.api._1homesHomeidPostWithHttpInfo(param.homeid, param.name, options).toPromise();
  }

  /**
   * Update a home. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidPost(
    param: DefaultApi1homesHomeidPostRequest,
    options?: ConfigurationOptions
  ): Promise<HomeResponse> {
    return this.api._1homesHomeidPost(param.homeid, param.name, options).toPromise();
  }

  /**
   * Transfer devices to another home. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidTransferTohomeidPostWithHttpInfo(
    param: DefaultApi1homesHomeidTransferTohomeidPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<any>> {
    return this.api
      ._1homesHomeidTransferTohomeidPostWithHttpInfo(
        param.homeid,
        param.tohomeid,
        param.devices,
        options
      )
      .toPromise();
  }

  /**
   * Transfer devices to another home. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidTransferTohomeidPost(
    param: DefaultApi1homesHomeidTransferTohomeidPostRequest,
    options?: ConfigurationOptions
  ): Promise<any> {
    return this.api
      ._1homesHomeidTransferTohomeidPost(param.homeid, param.tohomeid, param.devices, options)
      .toPromise();
  }

  /**
   * Fetch the list of users in a home. Requires home.read OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidUsersGetWithHttpInfo(
    param: DefaultApi1homesHomeidUsersGetRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<Array<UserAndRole>>> {
    return this.api._1homesHomeidUsersGetWithHttpInfo(param.homeid, options).toPromise();
  }

  /**
   * Fetch the list of users in a home. Requires home.read OAuth2 scopes.
   * @param param the request object
   */
  public _1homesHomeidUsersGet(
    param: DefaultApi1homesHomeidUsersGetRequest,
    options?: ConfigurationOptions
  ): Promise<Array<UserAndRole>> {
    return this.api._1homesHomeidUsersGet(param.homeid, options).toPromise();
  }

  /**
   * Create a new home. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesPostWithHttpInfo(
    param: DefaultApi1homesPostRequest = {},
    options?: ConfigurationOptions
  ): Promise<HttpInfo<HomeResponse>> {
    return this.api._1homesPostWithHttpInfo(param.name, options).toPromise();
  }

  /**
   * Create a new home. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1homesPost(
    param: DefaultApi1homesPostRequest = {},
    options?: ConfigurationOptions
  ): Promise<HomeResponse> {
    return this.api._1homesPost(param.name, options).toPromise();
  }

  /**
   * Show a home invite. Requires home.read OAuth2 scopes.
   * @param param the request object
   */
  public _1invitesInvitetokenGetWithHttpInfo(
    param: DefaultApi1invitesInvitetokenGetRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<HomeInvite>> {
    return this.api._1invitesInvitetokenGetWithHttpInfo(param.invitetoken, options).toPromise();
  }

  /**
   * Show a home invite. Requires home.read OAuth2 scopes.
   * @param param the request object
   */
  public _1invitesInvitetokenGet(
    param: DefaultApi1invitesInvitetokenGetRequest,
    options?: ConfigurationOptions
  ): Promise<HomeInvite> {
    return this.api._1invitesInvitetokenGet(param.invitetoken, options).toPromise();
  }

  /**
   * Accept a home invite. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1invitesInvitetokenPostWithHttpInfo(
    param: DefaultApi1invitesInvitetokenPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<HomeResponse>> {
    return this.api._1invitesInvitetokenPostWithHttpInfo(param.invitetoken, options).toPromise();
  }

  /**
   * Accept a home invite. Requires home.write OAuth2 scopes.
   * @param param the request object
   */
  public _1invitesInvitetokenPost(
    param: DefaultApi1invitesInvitetokenPostRequest,
    options?: ConfigurationOptions
  ): Promise<HomeResponse> {
    return this.api._1invitesInvitetokenPost(param.invitetoken, options).toPromise();
  }

  /**
   * Delete a signal. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1signalsSignalidDeletePostWithHttpInfo(
    param: DefaultApi1signalsSignalidDeletePostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<any>> {
    return this.api._1signalsSignalidDeletePostWithHttpInfo(param.signalid, options).toPromise();
  }

  /**
   * Delete a signal. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1signalsSignalidDeletePost(
    param: DefaultApi1signalsSignalidDeletePostRequest,
    options?: ConfigurationOptions
  ): Promise<any> {
    return this.api._1signalsSignalidDeletePost(param.signalid, options).toPromise();
  }

  /**
   * Update a signal. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1signalsSignalidPostWithHttpInfo(
    param: DefaultApi1signalsSignalidPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<Signal>> {
    return this.api
      ._1signalsSignalidPostWithHttpInfo(param.signalid, param.image, param.name, options)
      .toPromise();
  }

  /**
   * Update a signal. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1signalsSignalidPost(
    param: DefaultApi1signalsSignalidPostRequest,
    options?: ConfigurationOptions
  ): Promise<Signal> {
    return this.api
      ._1signalsSignalidPost(param.signalid, param.image, param.name, options)
      .toPromise();
  }

  /**
   * Send a signal. Requires sendir OAuth2 scopes.
   * @param param the request object
   */
  public _1signalsSignalidSendPostWithHttpInfo(
    param: DefaultApi1signalsSignalidSendPostRequest,
    options?: ConfigurationOptions
  ): Promise<HttpInfo<any>> {
    return this.api._1signalsSignalidSendPostWithHttpInfo(param.signalid, options).toPromise();
  }

  /**
   * Send a signal. Requires sendir OAuth2 scopes.
   * @param param the request object
   */
  public _1signalsSignalidSendPost(
    param: DefaultApi1signalsSignalidSendPostRequest,
    options?: ConfigurationOptions
  ): Promise<any> {
    return this.api._1signalsSignalidSendPost(param.signalid, options).toPromise();
  }

  /**
   * Fetch the authenticated user\'s information. Requires basic.read OAuth2 scopes.
   * @param param the request object
   */
  public _1usersMeGetWithHttpInfo(
    param: DefaultApi1usersMeGetRequest = {},
    options?: ConfigurationOptions
  ): Promise<HttpInfo<UserResponse>> {
    return this.api._1usersMeGetWithHttpInfo(options).toPromise();
  }

  /**
   * Fetch the authenticated user\'s information. Requires basic.read OAuth2 scopes.
   * @param param the request object
   */
  public _1usersMeGet(
    param: DefaultApi1usersMeGetRequest = {},
    options?: ConfigurationOptions
  ): Promise<UserResponse> {
    return this.api._1usersMeGet(options).toPromise();
  }

  /**
   * Update authenticated user\'s information. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1usersMePostWithHttpInfo(
    param: DefaultApi1usersMePostRequest = {},
    options?: ConfigurationOptions
  ): Promise<HttpInfo<UserResponse>> {
    return this.api
      ._1usersMePostWithHttpInfo(
        param.country,
        param.distanceUnit,
        param.nickname,
        param.tempUnit,
        options
      )
      .toPromise();
  }

  /**
   * Update authenticated user\'s information. Requires basic.write OAuth2 scopes.
   * @param param the request object
   */
  public _1usersMePost(
    param: DefaultApi1usersMePostRequest = {},
    options?: ConfigurationOptions
  ): Promise<UserResponse> {
    return this.api
      ._1usersMePost(param.country, param.distanceUnit, param.nickname, param.tempUnit, options)
      .toPromise();
  }
}
