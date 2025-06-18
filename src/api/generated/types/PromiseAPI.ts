import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, PromiseConfigurationOptions, wrapOptions } from '../configuration';
import { PromiseMiddleware, Middleware, PromiseMiddlewareWrapper } from '../middleware';

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
export class PromiseDefaultApi {
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
   * @param [appliances] List of all appliance IDs, comma separated.
   */
  public _1applianceOrdersPostWithHttpInfo(
    appliances?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<any>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1applianceOrdersPostWithHttpInfo(appliances, observableOptions);
    return result.toPromise();
  }

  /**
   * Reorder appliances. Requires basic.write OAuth2 scopes.
   * @param [appliances] List of all appliance IDs, comma separated.
   */
  public _1applianceOrdersPost(
    appliances?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<any> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1applianceOrdersPost(appliances, observableOptions);
    return result.toPromise();
  }

  /**
   * Update air conditioner settings. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [airDirection] AC air direction. Empty means automatic.
   * @param [airDirectionH] AC horizontal air direction.
   * @param [airVolume] AC air volume. Empty means automatic. Numbers express the amount of volume. The range of AirVolumes which the air conditioner accepts depends on the air conditioner model and operation mode. Check the \\\&#39;AirConRangeMode\\\&#39; information in the response for the range of the particular air conditioner model and operation mode.
   * @param [button] Button. Specify \\\&#39;power-off\\\&#39; always if you want the air conditioner powered off. Empty means powered on.
   * @param [operationMode] AC operation mode. The range of operation modes which the air conditioner accepts depends on the air conditioner model. Check the \\\&#39;AirConRangeMode\\\&#39; information in the response for the range of the particular air conditioner model.
   * @param [temperature] Temperature. The temperature in string format. The unit is described in Aircon object. The range of Temperatures which the air conditioner accepts depends on the air conditioner model and operation mode. Check the \\\&#39;AirConRangeMode\\\&#39; information in the response for the range of the particular air conditioner model and operation mode.
   * @param [temperatureUnit] Temperature unit. \\\&#39;c\\\&#39; or \\\&#39;f\\\&#39; or \\\&#39;\\\&#39; for unknown.
   */
  public _1appliancesApplianceidAirconSettingsPostWithHttpInfo(
    applianceid: string,
    airDirection?: string,
    airDirectionH?: string,
    airVolume?: string,
    button?: string,
    operationMode?: string,
    temperature?: string,
    temperatureUnit?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<AirconSettingsResponse>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesApplianceidAirconSettingsPostWithHttpInfo(
      applianceid,
      airDirection,
      airDirectionH,
      airVolume,
      button,
      operationMode,
      temperature,
      temperatureUnit,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Update air conditioner settings. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [airDirection] AC air direction. Empty means automatic.
   * @param [airDirectionH] AC horizontal air direction.
   * @param [airVolume] AC air volume. Empty means automatic. Numbers express the amount of volume. The range of AirVolumes which the air conditioner accepts depends on the air conditioner model and operation mode. Check the \\\&#39;AirConRangeMode\\\&#39; information in the response for the range of the particular air conditioner model and operation mode.
   * @param [button] Button. Specify \\\&#39;power-off\\\&#39; always if you want the air conditioner powered off. Empty means powered on.
   * @param [operationMode] AC operation mode. The range of operation modes which the air conditioner accepts depends on the air conditioner model. Check the \\\&#39;AirConRangeMode\\\&#39; information in the response for the range of the particular air conditioner model.
   * @param [temperature] Temperature. The temperature in string format. The unit is described in Aircon object. The range of Temperatures which the air conditioner accepts depends on the air conditioner model and operation mode. Check the \\\&#39;AirConRangeMode\\\&#39; information in the response for the range of the particular air conditioner model and operation mode.
   * @param [temperatureUnit] Temperature unit. \\\&#39;c\\\&#39; or \\\&#39;f\\\&#39; or \\\&#39;\\\&#39; for unknown.
   */
  public _1appliancesApplianceidAirconSettingsPost(
    applianceid: string,
    airDirection?: string,
    airDirectionH?: string,
    airVolume?: string,
    button?: string,
    operationMode?: string,
    temperature?: string,
    temperatureUnit?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<AirconSettingsResponse> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesApplianceidAirconSettingsPost(
      applianceid,
      airDirection,
      airDirectionH,
      airVolume,
      button,
      operationMode,
      temperature,
      temperatureUnit,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Delete an appliance. Requires basic.write OAuth2 scopes.
   * @param applianceid Appliance Id
   */
  public _1appliancesApplianceidDeletePostWithHttpInfo(
    applianceid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<any>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesApplianceidDeletePostWithHttpInfo(
      applianceid,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Delete an appliance. Requires basic.write OAuth2 scopes.
   * @param applianceid Appliance Id
   */
  public _1appliancesApplianceidDeletePost(
    applianceid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<any> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesApplianceidDeletePost(applianceid, observableOptions);
    return result.toPromise();
  }

  /**
   * Send light signal. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [button] Button name.
   */
  public _1appliancesApplianceidLightPostWithHttpInfo(
    applianceid: string,
    button?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<LightState>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesApplianceidLightPostWithHttpInfo(
      applianceid,
      button,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Send light signal. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [button] Button name.
   */
  public _1appliancesApplianceidLightPost(
    applianceid: string,
    button?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<LightState> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesApplianceidLightPost(
      applianceid,
      button,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Send light_projector signal. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [button] Button name.
   */
  public _1appliancesApplianceidLightProjectorPostWithHttpInfo(
    applianceid: string,
    button?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<any>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesApplianceidLightProjectorPostWithHttpInfo(
      applianceid,
      button,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Send light_projector signal. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [button] Button name.
   */
  public _1appliancesApplianceidLightProjectorPost(
    applianceid: string,
    button?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<any> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesApplianceidLightProjectorPost(
      applianceid,
      button,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Update an appliance. Requires basic.write OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [image] Basename of the image file included in the app. Ex: \\\&#39;ico_ac_1\\\&#39;.
   * @param [nickname] Appliance name.
   */
  public _1appliancesApplianceidPostWithHttpInfo(
    applianceid: string,
    image?: string,
    nickname?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<ApplianceResponse>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesApplianceidPostWithHttpInfo(
      applianceid,
      image,
      nickname,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Update an appliance. Requires basic.write OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [image] Basename of the image file included in the app. Ex: \\\&#39;ico_ac_1\\\&#39;.
   * @param [nickname] Appliance name.
   */
  public _1appliancesApplianceidPost(
    applianceid: string,
    image?: string,
    nickname?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<ApplianceResponse> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesApplianceidPost(
      applianceid,
      image,
      nickname,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Send SESAME bot click request. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   */
  public _1appliancesApplianceidSesameBotClickPostWithHttpInfo(
    applianceid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<any>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesApplianceidSesameBotClickPostWithHttpInfo(
      applianceid,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Send SESAME bot click request. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   */
  public _1appliancesApplianceidSesameBotClickPost(
    applianceid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<any> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesApplianceidSesameBotClickPost(
      applianceid,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Reorder signals. Requires basic.write OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [signals] List of all signal IDs, comma separated.
   */
  public _1appliancesApplianceidSignalOrdersPostWithHttpInfo(
    applianceid: string,
    signals?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<any>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesApplianceidSignalOrdersPostWithHttpInfo(
      applianceid,
      signals,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Reorder signals. Requires basic.write OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [signals] List of all signal IDs, comma separated.
   */
  public _1appliancesApplianceidSignalOrdersPost(
    applianceid: string,
    signals?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<any> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesApplianceidSignalOrdersPost(
      applianceid,
      signals,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Fetch the list of signals. Requires basic.read OAuth2 scopes.
   * @param applianceid Appliance Id
   */
  public _1appliancesApplianceidSignalsGetWithHttpInfo(
    applianceid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<Array<Signal>>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesApplianceidSignalsGetWithHttpInfo(
      applianceid,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Fetch the list of signals. Requires basic.read OAuth2 scopes.
   * @param applianceid Appliance Id
   */
  public _1appliancesApplianceidSignalsGet(
    applianceid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<Array<Signal>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesApplianceidSignalsGet(applianceid, observableOptions);
    return result.toPromise();
  }

  /**
   * Create a new signal. Requires basic.write OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [image] Basename of the image file included in the app. Ex: \\\&#39;ico_io\\\&#39;.
   * @param [message] JSON serialized object describing infrared signals. Includes \\\&#39;data\\\&#39;, \\\&#39;freq\\\&#39; and \\\&#39;format\\\&#39; keys.
   * @param [name] Signal name.
   */
  public _1appliancesApplianceidSignalsPostWithHttpInfo(
    applianceid: string,
    image?: string,
    message?: string,
    name?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<Signal>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesApplianceidSignalsPostWithHttpInfo(
      applianceid,
      image,
      message,
      name,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Create a new signal. Requires basic.write OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [image] Basename of the image file included in the app. Ex: \\\&#39;ico_io\\\&#39;.
   * @param [message] JSON serialized object describing infrared signals. Includes \\\&#39;data\\\&#39;, \\\&#39;freq\\\&#39; and \\\&#39;format\\\&#39; keys.
   * @param [name] Signal name.
   */
  public _1appliancesApplianceidSignalsPost(
    applianceid: string,
    image?: string,
    message?: string,
    name?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<Signal> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesApplianceidSignalsPost(
      applianceid,
      image,
      message,
      name,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Send TV signal. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [button] Button name.
   */
  public _1appliancesApplianceidTvPostWithHttpInfo(
    applianceid: string,
    button?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<TVState>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesApplianceidTvPostWithHttpInfo(
      applianceid,
      button,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Send TV signal. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [button] Button name.
   */
  public _1appliancesApplianceidTvPost(
    applianceid: string,
    button?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<TVState> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesApplianceidTvPost(applianceid, button, observableOptions);
    return result.toPromise();
  }

  /**
   * Fetch the list of appliances. Requires basic.read OAuth2 scopes.
   */
  public _1appliancesGetWithHttpInfo(
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<Array<ApplianceResponse>>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesGetWithHttpInfo(observableOptions);
    return result.toPromise();
  }

  /**
   * Fetch the list of appliances. Requires basic.read OAuth2 scopes.
   */
  public _1appliancesGet(
    _options?: PromiseConfigurationOptions
  ): Promise<Array<ApplianceResponse>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesGet(observableOptions);
    return result.toPromise();
  }

  /**
   * Create a new appliance. Requires basic.write OAuth2 scopes.
   * @param [device]
   * @param [image] Basename of the image file included in the app. Ex: \\\&#39;ico_ac_1\\\&#39;.
   * @param [model] ApplianceModel ID if the appliance we\\\&#39;re trying to create is included in IRDB.
   * @param [modelType] Enum of \\\&#39;AC\\\&#39;, \\\&#39;TV\\\&#39;, \\\&#39;Light\\\&#39;
   * @param [nickname] Appliance name.
   */
  public _1appliancesPostWithHttpInfo(
    device?: string,
    image?: string,
    model?: string,
    modelType?: string,
    nickname?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<ApplianceResponse>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesPostWithHttpInfo(
      device,
      image,
      model,
      modelType,
      nickname,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Create a new appliance. Requires basic.write OAuth2 scopes.
   * @param [device]
   * @param [image] Basename of the image file included in the app. Ex: \\\&#39;ico_ac_1\\\&#39;.
   * @param [model] ApplianceModel ID if the appliance we\\\&#39;re trying to create is included in IRDB.
   * @param [modelType] Enum of \\\&#39;AC\\\&#39;, \\\&#39;TV\\\&#39;, \\\&#39;Light\\\&#39;
   * @param [nickname] Appliance name.
   */
  public _1appliancesPost(
    device?: string,
    image?: string,
    model?: string,
    modelType?: string,
    nickname?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<ApplianceResponse> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1appliancesPost(
      device,
      image,
      model,
      modelType,
      nickname,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Fetch the list of ble_private_macros. Requires basic.read OAuth2 scopes.
   * @param applianceid Appliance Id
   */
  public _1bleAppliancesApplianceidPrivateMacrosGetWithHttpInfo(
    applianceid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<Array<BLEPrivateMacroResponse>>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1bleAppliancesApplianceidPrivateMacrosGetWithHttpInfo(
      applianceid,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Fetch the list of ble_private_macros. Requires basic.read OAuth2 scopes.
   * @param applianceid Appliance Id
   */
  public _1bleAppliancesApplianceidPrivateMacrosGet(
    applianceid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<Array<BLEPrivateMacroResponse>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1bleAppliancesApplianceidPrivateMacrosGet(
      applianceid,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Send BLE Private Macro control request. Requires sendir OAuth2 scopes.
   * @param privatemacroid BLE Private Macro ID
   */
  public _1blePrivateMacrosPrivatemacroidExecPostWithHttpInfo(
    privatemacroid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<any>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1blePrivateMacrosPrivatemacroidExecPostWithHttpInfo(
      privatemacroid,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Send BLE Private Macro control request. Requires sendir OAuth2 scopes.
   * @param privatemacroid BLE Private Macro ID
   */
  public _1blePrivateMacrosPrivatemacroidExecPost(
    privatemacroid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<any> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1blePrivateMacrosPrivatemacroidExecPost(
      privatemacroid,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Find the air conditioner best matching the provided infrared signal. Requires detectappliance OAuth2 scopes.
   * @param [device]
   * @param [message] JSON serialized object describing infrared signals. Includes \\\&#39;data\\\&#39;, \\\&#39;freq\\\&#39; and \\\&#39;format\\\&#39; keys.
   */
  public _1detectappliancePostWithHttpInfo(
    device?: string,
    message?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<Array<ApplianceModelAndParam>>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1detectappliancePostWithHttpInfo(device, message, observableOptions);
    return result.toPromise();
  }

  /**
   * Find the air conditioner best matching the provided infrared signal. Requires detectappliance OAuth2 scopes.
   * @param [device]
   * @param [message] JSON serialized object describing infrared signals. Includes \\\&#39;data\\\&#39;, \\\&#39;freq\\\&#39; and \\\&#39;format\\\&#39; keys.
   */
  public _1detectappliancePost(
    device?: string,
    message?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<Array<ApplianceModelAndParam>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1detectappliancePost(device, message, observableOptions);
    return result.toPromise();
  }

  /**
   * Fetch the list of appliances registered to the Remo device. Requires basic.read OAuth2 scopes.
   * @param deviceid Device Id
   */
  public _1devicesDeviceidAppliancesGetWithHttpInfo(
    deviceid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<Array<ApplianceResponse>>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1devicesDeviceidAppliancesGetWithHttpInfo(deviceid, observableOptions);
    return result.toPromise();
  }

  /**
   * Fetch the list of appliances registered to the Remo device. Requires basic.read OAuth2 scopes.
   * @param deviceid Device Id
   */
  public _1devicesDeviceidAppliancesGet(
    deviceid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<Array<ApplianceResponse>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1devicesDeviceidAppliancesGet(deviceid, observableOptions);
    return result.toPromise();
  }

  /**
   * Delete a device. Requires basic.write OAuth2 scopes.
   * @param deviceid Device Id
   */
  public _1devicesDeviceidDeletePostWithHttpInfo(
    deviceid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<any>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1devicesDeviceidDeletePostWithHttpInfo(deviceid, observableOptions);
    return result.toPromise();
  }

  /**
   * Delete a device. Requires basic.write OAuth2 scopes.
   * @param deviceid Device Id
   */
  public _1devicesDeviceidDeletePost(
    deviceid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<any> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1devicesDeviceidDeletePost(deviceid, observableOptions);
    return result.toPromise();
  }

  /**
   * Update a device\'s humidity offset. Requires basic.write OAuth2 scopes.
   * @param deviceid Device Id
   * @param [offset] Humidity offset value added to the measured humidity.
   */
  public _1devicesDeviceidHumidityOffsetPostWithHttpInfo(
    deviceid: string,
    offset?: number,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<DeviceResponse>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1devicesDeviceidHumidityOffsetPostWithHttpInfo(
      deviceid,
      offset,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Update a device\'s humidity offset. Requires basic.write OAuth2 scopes.
   * @param deviceid Device Id
   * @param [offset] Humidity offset value added to the measured humidity.
   */
  public _1devicesDeviceidHumidityOffsetPost(
    deviceid: string,
    offset?: number,
    _options?: PromiseConfigurationOptions
  ): Promise<DeviceResponse> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1devicesDeviceidHumidityOffsetPost(
      deviceid,
      offset,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Update a device. Requires basic.write OAuth2 scopes.
   * @param deviceid Device Id
   * @param [name]
   */
  public _1devicesDeviceidPostWithHttpInfo(
    deviceid: string,
    name?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<DeviceResponse>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1devicesDeviceidPostWithHttpInfo(deviceid, name, observableOptions);
    return result.toPromise();
  }

  /**
   * Update a device. Requires basic.write OAuth2 scopes.
   * @param deviceid Device Id
   * @param [name]
   */
  public _1devicesDeviceidPost(
    deviceid: string,
    name?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<DeviceResponse> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1devicesDeviceidPost(deviceid, name, observableOptions);
    return result.toPromise();
  }

  /**
   * Update a device\'s temperature offset. Requires basic.write OAuth2 scopes.
   * @param deviceid Device Id
   * @param [offset] Temperature offset value added to the measured temperature.
   */
  public _1devicesDeviceidTemperatureOffsetPostWithHttpInfo(
    deviceid: string,
    offset?: number,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<DeviceResponse>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1devicesDeviceidTemperatureOffsetPostWithHttpInfo(
      deviceid,
      offset,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Update a device\'s temperature offset. Requires basic.write OAuth2 scopes.
   * @param deviceid Device Id
   * @param [offset] Temperature offset value added to the measured temperature.
   */
  public _1devicesDeviceidTemperatureOffsetPost(
    deviceid: string,
    offset?: number,
    _options?: PromiseConfigurationOptions
  ): Promise<DeviceResponse> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1devicesDeviceidTemperatureOffsetPost(
      deviceid,
      offset,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Fetch the list of Remo devices. Requires basic.read OAuth2 scopes.
   */
  public _1devicesGetWithHttpInfo(
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<Array<DeviceResponse>>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1devicesGetWithHttpInfo(observableOptions);
    return result.toPromise();
  }

  /**
   * Fetch the list of Remo devices. Requires basic.read OAuth2 scopes.
   */
  public _1devicesGet(_options?: PromiseConfigurationOptions): Promise<Array<DeviceResponse>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1devicesGet(observableOptions);
    return result.toPromise();
  }

  /**
   * Notify Remo E / Remo E lite to refresh one or more ECHONET Lite properties. This endpoint is subject to ECHONET Lite specific rate limiting. See the rate limiting section of the documentation for more details. Requires echonetlite.*.read OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [epc] Comma separated EPCs in hex. eg: cf,da
   */
  public _1echonetliteAppliancesApplianceidRefreshPostWithHttpInfo(
    applianceid: string,
    epc?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<any>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1echonetliteAppliancesApplianceidRefreshPostWithHttpInfo(
      applianceid,
      epc,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Notify Remo E / Remo E lite to refresh one or more ECHONET Lite properties. This endpoint is subject to ECHONET Lite specific rate limiting. See the rate limiting section of the documentation for more details. Requires echonetlite.*.read OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [epc] Comma separated EPCs in hex. eg: cf,da
   */
  public _1echonetliteAppliancesApplianceidRefreshPost(
    applianceid: string,
    epc?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<any> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1echonetliteAppliancesApplianceidRefreshPost(
      applianceid,
      epc,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Set one ECHONET Lite property. This endpoint is subject to ECHONET Lite specific rate limiting. See the rate limiting section of the documentation for more details. Requires echonetlite.*.write OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [epc] EPC in hex string. eg: cf
   * @param [val] Value in hex string. String length must be 2x the number of bytes according to ECHONET Lite spec, and filled with zero if necessary. eg: 000000FF
   */
  public _1echonetliteAppliancesApplianceidSetPostWithHttpInfo(
    applianceid: string,
    epc?: string,
    val?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<any>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1echonetliteAppliancesApplianceidSetPostWithHttpInfo(
      applianceid,
      epc,
      val,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Set one ECHONET Lite property. This endpoint is subject to ECHONET Lite specific rate limiting. See the rate limiting section of the documentation for more details. Requires echonetlite.*.write OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [epc] EPC in hex string. eg: cf
   * @param [val] Value in hex string. String length must be 2x the number of bytes according to ECHONET Lite spec, and filled with zero if necessary. eg: 000000FF
   */
  public _1echonetliteAppliancesApplianceidSetPost(
    applianceid: string,
    epc?: string,
    val?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<any> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1echonetliteAppliancesApplianceidSetPost(
      applianceid,
      epc,
      val,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Fetch the list of ECHONET Lite appliances. Requires basic.read OAuth2 scopes.
   */
  public _1echonetliteAppliancesGetWithHttpInfo(
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<EchonetLiteApplianceResponse>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1echonetliteAppliancesGetWithHttpInfo(observableOptions);
    return result.toPromise();
  }

  /**
   * Fetch the list of ECHONET Lite appliances. Requires basic.read OAuth2 scopes.
   */
  public _1echonetliteAppliancesGet(
    _options?: PromiseConfigurationOptions
  ): Promise<EchonetLiteApplianceResponse> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1echonetliteAppliancesGet(observableOptions);
    return result.toPromise();
  }

  /**
   * Fetch the list of homes. Requires home.read OAuth2 scopes.
   */
  public _1homesGetWithHttpInfo(
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<Array<HomeResponse>>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesGetWithHttpInfo(observableOptions);
    return result.toPromise();
  }

  /**
   * Fetch the list of homes. Requires home.read OAuth2 scopes.
   */
  public _1homesGet(_options?: PromiseConfigurationOptions): Promise<Array<HomeResponse>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesGet(observableOptions);
    return result.toPromise();
  }

  /**
   * Delete a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidDeletePostWithHttpInfo(
    homeid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<any>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidDeletePostWithHttpInfo(homeid, observableOptions);
    return result.toPromise();
  }

  /**
   * Delete a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidDeletePost(
    homeid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<any> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidDeletePost(homeid, observableOptions);
    return result.toPromise();
  }

  /**
   * Fetch the list of devices in a home. Requires home.read OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidDevicesGetWithHttpInfo(
    homeid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<Array<DeviceResponse>>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidDevicesGetWithHttpInfo(homeid, observableOptions);
    return result.toPromise();
  }

  /**
   * Fetch the list of devices in a home. Requires home.read OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidDevicesGet(
    homeid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<Array<DeviceResponse>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidDevicesGet(homeid, observableOptions);
    return result.toPromise();
  }

  /**
   * Create a new home invite. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidInvitesPostWithHttpInfo(
    homeid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<HomeInvite>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidInvitesPostWithHttpInfo(homeid, observableOptions);
    return result.toPromise();
  }

  /**
   * Create a new home invite. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidInvitesPost(
    homeid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HomeInvite> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidInvitesPost(homeid, observableOptions);
    return result.toPromise();
  }

  /**
   * Kick a user from a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   * @param [user]
   */
  public _1homesHomeidKickPostWithHttpInfo(
    homeid: string,
    user?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<any>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidKickPostWithHttpInfo(homeid, user, observableOptions);
    return result.toPromise();
  }

  /**
   * Kick a user from a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   * @param [user]
   */
  public _1homesHomeidKickPost(
    homeid: string,
    user?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<any> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidKickPost(homeid, user, observableOptions);
    return result.toPromise();
  }

  /**
   * Delete a home\'s location. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidLocationDeletePostWithHttpInfo(
    homeid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<HomeResponse>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidLocationDeletePostWithHttpInfo(homeid, observableOptions);
    return result.toPromise();
  }

  /**
   * Delete a home\'s location. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidLocationDeletePost(
    homeid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HomeResponse> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidLocationDeletePost(homeid, observableOptions);
    return result.toPromise();
  }

  /**
   * Update a home\'s location. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidLocationPostWithHttpInfo(
    homeid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<HomeResponse>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidLocationPostWithHttpInfo(homeid, observableOptions);
    return result.toPromise();
  }

  /**
   * Update a home\'s location. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidLocationPost(
    homeid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HomeResponse> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidLocationPost(homeid, observableOptions);
    return result.toPromise();
  }

  /**
   * Update the user\'s location state for a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidLocationStateUpdatePostWithHttpInfo(
    homeid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<any>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidLocationStateUpdatePostWithHttpInfo(
      homeid,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Update the user\'s location state for a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidLocationStateUpdatePost(
    homeid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<any> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidLocationStateUpdatePost(homeid, observableOptions);
    return result.toPromise();
  }

  /**
   * Change the owner of the home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   * @param [user]
   */
  public _1homesHomeidOwnerPostWithHttpInfo(
    homeid: string,
    user?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<HomeResponse>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidOwnerPostWithHttpInfo(homeid, user, observableOptions);
    return result.toPromise();
  }

  /**
   * Change the owner of the home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   * @param [user]
   */
  public _1homesHomeidOwnerPost(
    homeid: string,
    user?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HomeResponse> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidOwnerPost(homeid, user, observableOptions);
    return result.toPromise();
  }

  /**
   * Part from a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidPartPostWithHttpInfo(
    homeid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<any>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidPartPostWithHttpInfo(homeid, observableOptions);
    return result.toPromise();
  }

  /**
   * Part from a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidPartPost(
    homeid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<any> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidPartPost(homeid, observableOptions);
    return result.toPromise();
  }

  /**
   * Update a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   * @param [name]
   */
  public _1homesHomeidPostWithHttpInfo(
    homeid: string,
    name?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<HomeResponse>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidPostWithHttpInfo(homeid, name, observableOptions);
    return result.toPromise();
  }

  /**
   * Update a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   * @param [name]
   */
  public _1homesHomeidPost(
    homeid: string,
    name?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HomeResponse> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidPost(homeid, name, observableOptions);
    return result.toPromise();
  }

  /**
   * Transfer devices to another home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   * @param tohomeid Transfer to Home Id
   * @param [devices]
   */
  public _1homesHomeidTransferTohomeidPostWithHttpInfo(
    homeid: string,
    tohomeid: string,
    devices?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<any>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidTransferTohomeidPostWithHttpInfo(
      homeid,
      tohomeid,
      devices,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Transfer devices to another home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   * @param tohomeid Transfer to Home Id
   * @param [devices]
   */
  public _1homesHomeidTransferTohomeidPost(
    homeid: string,
    tohomeid: string,
    devices?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<any> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidTransferTohomeidPost(
      homeid,
      tohomeid,
      devices,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Fetch the list of users in a home. Requires home.read OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidUsersGetWithHttpInfo(
    homeid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<Array<UserAndRole>>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidUsersGetWithHttpInfo(homeid, observableOptions);
    return result.toPromise();
  }

  /**
   * Fetch the list of users in a home. Requires home.read OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidUsersGet(
    homeid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<Array<UserAndRole>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesHomeidUsersGet(homeid, observableOptions);
    return result.toPromise();
  }

  /**
   * Create a new home. Requires home.write OAuth2 scopes.
   * @param [name]
   */
  public _1homesPostWithHttpInfo(
    name?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<HomeResponse>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesPostWithHttpInfo(name, observableOptions);
    return result.toPromise();
  }

  /**
   * Create a new home. Requires home.write OAuth2 scopes.
   * @param [name]
   */
  public _1homesPost(name?: string, _options?: PromiseConfigurationOptions): Promise<HomeResponse> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1homesPost(name, observableOptions);
    return result.toPromise();
  }

  /**
   * Show a home invite. Requires home.read OAuth2 scopes.
   * @param invitetoken Invite Token
   */
  public _1invitesInvitetokenGetWithHttpInfo(
    invitetoken: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<HomeInvite>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1invitesInvitetokenGetWithHttpInfo(invitetoken, observableOptions);
    return result.toPromise();
  }

  /**
   * Show a home invite. Requires home.read OAuth2 scopes.
   * @param invitetoken Invite Token
   */
  public _1invitesInvitetokenGet(
    invitetoken: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HomeInvite> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1invitesInvitetokenGet(invitetoken, observableOptions);
    return result.toPromise();
  }

  /**
   * Accept a home invite. Requires home.write OAuth2 scopes.
   * @param invitetoken Invite Token
   */
  public _1invitesInvitetokenPostWithHttpInfo(
    invitetoken: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<HomeResponse>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1invitesInvitetokenPostWithHttpInfo(invitetoken, observableOptions);
    return result.toPromise();
  }

  /**
   * Accept a home invite. Requires home.write OAuth2 scopes.
   * @param invitetoken Invite Token
   */
  public _1invitesInvitetokenPost(
    invitetoken: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HomeResponse> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1invitesInvitetokenPost(invitetoken, observableOptions);
    return result.toPromise();
  }

  /**
   * Delete a signal. Requires basic.write OAuth2 scopes.
   * @param signalid Signal Id
   */
  public _1signalsSignalidDeletePostWithHttpInfo(
    signalid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<any>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1signalsSignalidDeletePostWithHttpInfo(signalid, observableOptions);
    return result.toPromise();
  }

  /**
   * Delete a signal. Requires basic.write OAuth2 scopes.
   * @param signalid Signal Id
   */
  public _1signalsSignalidDeletePost(
    signalid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<any> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1signalsSignalidDeletePost(signalid, observableOptions);
    return result.toPromise();
  }

  /**
   * Update a signal. Requires basic.write OAuth2 scopes.
   * @param signalid Signal Id
   * @param [image] Basename of the image file included in the app. Ex: \\\&#39;ico_io\\\&#39;.
   * @param [name] Signal name.
   */
  public _1signalsSignalidPostWithHttpInfo(
    signalid: string,
    image?: string,
    name?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<Signal>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1signalsSignalidPostWithHttpInfo(
      signalid,
      image,
      name,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Update a signal. Requires basic.write OAuth2 scopes.
   * @param signalid Signal Id
   * @param [image] Basename of the image file included in the app. Ex: \\\&#39;ico_io\\\&#39;.
   * @param [name] Signal name.
   */
  public _1signalsSignalidPost(
    signalid: string,
    image?: string,
    name?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<Signal> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1signalsSignalidPost(signalid, image, name, observableOptions);
    return result.toPromise();
  }

  /**
   * Send a signal. Requires sendir OAuth2 scopes.
   * @param signalid Signal Id
   */
  public _1signalsSignalidSendPostWithHttpInfo(
    signalid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<any>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1signalsSignalidSendPostWithHttpInfo(signalid, observableOptions);
    return result.toPromise();
  }

  /**
   * Send a signal. Requires sendir OAuth2 scopes.
   * @param signalid Signal Id
   */
  public _1signalsSignalidSendPost(
    signalid: string,
    _options?: PromiseConfigurationOptions
  ): Promise<any> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1signalsSignalidSendPost(signalid, observableOptions);
    return result.toPromise();
  }

  /**
   * Fetch the authenticated user\'s information. Requires basic.read OAuth2 scopes.
   */
  public _1usersMeGetWithHttpInfo(
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<UserResponse>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1usersMeGetWithHttpInfo(observableOptions);
    return result.toPromise();
  }

  /**
   * Fetch the authenticated user\'s information. Requires basic.read OAuth2 scopes.
   */
  public _1usersMeGet(_options?: PromiseConfigurationOptions): Promise<UserResponse> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1usersMeGet(observableOptions);
    return result.toPromise();
  }

  /**
   * Update authenticated user\'s information. Requires basic.write OAuth2 scopes.
   * @param [country]
   * @param [distanceUnit]
   * @param [nickname]
   * @param [tempUnit]
   */
  public _1usersMePostWithHttpInfo(
    country?: string,
    distanceUnit?: string,
    nickname?: string,
    tempUnit?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<HttpInfo<UserResponse>> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1usersMePostWithHttpInfo(
      country,
      distanceUnit,
      nickname,
      tempUnit,
      observableOptions
    );
    return result.toPromise();
  }

  /**
   * Update authenticated user\'s information. Requires basic.write OAuth2 scopes.
   * @param [country]
   * @param [distanceUnit]
   * @param [nickname]
   * @param [tempUnit]
   */
  public _1usersMePost(
    country?: string,
    distanceUnit?: string,
    nickname?: string,
    tempUnit?: string,
    _options?: PromiseConfigurationOptions
  ): Promise<UserResponse> {
    const observableOptions = wrapOptions(_options);
    const result = this.api._1usersMePost(
      country,
      distanceUnit,
      nickname,
      tempUnit,
      observableOptions
    );
    return result.toPromise();
  }
}
