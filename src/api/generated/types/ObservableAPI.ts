import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions, mergeConfiguration } from '../configuration';
import type { Middleware } from '../middleware';
import { Observable, of, from } from '../rxjsStub';
import { mergeMap, map } from '../rxjsStub';
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

import { DefaultApiRequestFactory, DefaultApiResponseProcessor } from '../apis/DefaultApi';
export class ObservableDefaultApi {
  private requestFactory: DefaultApiRequestFactory;
  private responseProcessor: DefaultApiResponseProcessor;
  private configuration: Configuration;

  public constructor(
    configuration: Configuration,
    requestFactory?: DefaultApiRequestFactory,
    responseProcessor?: DefaultApiResponseProcessor
  ) {
    this.configuration = configuration;
    this.requestFactory = requestFactory || new DefaultApiRequestFactory(configuration);
    this.responseProcessor = responseProcessor || new DefaultApiResponseProcessor();
  }

  /**
   * Reorder appliances. Requires basic.write OAuth2 scopes.
   * @param [appliances] List of all appliance IDs, comma separated.
   */
  public _1applianceOrdersPostWithHttpInfo(
    appliances?: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<any>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1applianceOrdersPost(appliances, _config);
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1applianceOrdersPostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Reorder appliances. Requires basic.write OAuth2 scopes.
   * @param [appliances] List of all appliance IDs, comma separated.
   */
  public _1applianceOrdersPost(
    appliances?: string,
    _options?: ConfigurationOptions
  ): Observable<any> {
    return this._1applianceOrdersPostWithHttpInfo(appliances, _options).pipe(
      map((apiResponse: HttpInfo<any>) => apiResponse.data)
    );
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
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<AirconSettingsResponse>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1appliancesApplianceidAirconSettingsPost(
      applianceid,
      airDirection,
      airDirectionH,
      airVolume,
      button,
      operationMode,
      temperature,
      temperatureUnit,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1appliancesApplianceidAirconSettingsPostWithHttpInfo(rsp)
            )
          );
        })
      );
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
    _options?: ConfigurationOptions
  ): Observable<AirconSettingsResponse> {
    return this._1appliancesApplianceidAirconSettingsPostWithHttpInfo(
      applianceid,
      airDirection,
      airDirectionH,
      airVolume,
      button,
      operationMode,
      temperature,
      temperatureUnit,
      _options
    ).pipe(map((apiResponse: HttpInfo<AirconSettingsResponse>) => apiResponse.data));
  }

  /**
   * Delete an appliance. Requires basic.write OAuth2 scopes.
   * @param applianceid Appliance Id
   */
  public _1appliancesApplianceidDeletePostWithHttpInfo(
    applianceid: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<any>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1appliancesApplianceidDeletePost(
      applianceid,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1appliancesApplianceidDeletePostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Delete an appliance. Requires basic.write OAuth2 scopes.
   * @param applianceid Appliance Id
   */
  public _1appliancesApplianceidDeletePost(
    applianceid: string,
    _options?: ConfigurationOptions
  ): Observable<any> {
    return this._1appliancesApplianceidDeletePostWithHttpInfo(applianceid, _options).pipe(
      map((apiResponse: HttpInfo<any>) => apiResponse.data)
    );
  }

  /**
   * Send light signal. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [button] Button name.
   */
  public _1appliancesApplianceidLightPostWithHttpInfo(
    applianceid: string,
    button?: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<LightState>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1appliancesApplianceidLightPost(
      applianceid,
      button,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1appliancesApplianceidLightPostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Send light signal. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [button] Button name.
   */
  public _1appliancesApplianceidLightPost(
    applianceid: string,
    button?: string,
    _options?: ConfigurationOptions
  ): Observable<LightState> {
    return this._1appliancesApplianceidLightPostWithHttpInfo(applianceid, button, _options).pipe(
      map((apiResponse: HttpInfo<LightState>) => apiResponse.data)
    );
  }

  /**
   * Send light_projector signal. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [button] Button name.
   */
  public _1appliancesApplianceidLightProjectorPostWithHttpInfo(
    applianceid: string,
    button?: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<any>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1appliancesApplianceidLightProjectorPost(
      applianceid,
      button,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1appliancesApplianceidLightProjectorPostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Send light_projector signal. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [button] Button name.
   */
  public _1appliancesApplianceidLightProjectorPost(
    applianceid: string,
    button?: string,
    _options?: ConfigurationOptions
  ): Observable<any> {
    return this._1appliancesApplianceidLightProjectorPostWithHttpInfo(
      applianceid,
      button,
      _options
    ).pipe(map((apiResponse: HttpInfo<any>) => apiResponse.data));
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
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<ApplianceResponse>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1appliancesApplianceidPost(
      applianceid,
      image,
      nickname,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1appliancesApplianceidPostWithHttpInfo(rsp)
            )
          );
        })
      );
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
    _options?: ConfigurationOptions
  ): Observable<ApplianceResponse> {
    return this._1appliancesApplianceidPostWithHttpInfo(
      applianceid,
      image,
      nickname,
      _options
    ).pipe(map((apiResponse: HttpInfo<ApplianceResponse>) => apiResponse.data));
  }

  /**
   * Send SESAME bot click request. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   */
  public _1appliancesApplianceidSesameBotClickPostWithHttpInfo(
    applianceid: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<any>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1appliancesApplianceidSesameBotClickPost(
      applianceid,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1appliancesApplianceidSesameBotClickPostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Send SESAME bot click request. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   */
  public _1appliancesApplianceidSesameBotClickPost(
    applianceid: string,
    _options?: ConfigurationOptions
  ): Observable<any> {
    return this._1appliancesApplianceidSesameBotClickPostWithHttpInfo(applianceid, _options).pipe(
      map((apiResponse: HttpInfo<any>) => apiResponse.data)
    );
  }

  /**
   * Reorder signals. Requires basic.write OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [signals] List of all signal IDs, comma separated.
   */
  public _1appliancesApplianceidSignalOrdersPostWithHttpInfo(
    applianceid: string,
    signals?: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<any>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1appliancesApplianceidSignalOrdersPost(
      applianceid,
      signals,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1appliancesApplianceidSignalOrdersPostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Reorder signals. Requires basic.write OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [signals] List of all signal IDs, comma separated.
   */
  public _1appliancesApplianceidSignalOrdersPost(
    applianceid: string,
    signals?: string,
    _options?: ConfigurationOptions
  ): Observable<any> {
    return this._1appliancesApplianceidSignalOrdersPostWithHttpInfo(
      applianceid,
      signals,
      _options
    ).pipe(map((apiResponse: HttpInfo<any>) => apiResponse.data));
  }

  /**
   * Fetch the list of signals. Requires basic.read OAuth2 scopes.
   * @param applianceid Appliance Id
   */
  public _1appliancesApplianceidSignalsGetWithHttpInfo(
    applianceid: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<Array<Signal>>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1appliancesApplianceidSignalsGet(
      applianceid,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1appliancesApplianceidSignalsGetWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Fetch the list of signals. Requires basic.read OAuth2 scopes.
   * @param applianceid Appliance Id
   */
  public _1appliancesApplianceidSignalsGet(
    applianceid: string,
    _options?: ConfigurationOptions
  ): Observable<Array<Signal>> {
    return this._1appliancesApplianceidSignalsGetWithHttpInfo(applianceid, _options).pipe(
      map((apiResponse: HttpInfo<Array<Signal>>) => apiResponse.data)
    );
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
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<Signal>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1appliancesApplianceidSignalsPost(
      applianceid,
      image,
      message,
      name,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1appliancesApplianceidSignalsPostWithHttpInfo(rsp)
            )
          );
        })
      );
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
    _options?: ConfigurationOptions
  ): Observable<Signal> {
    return this._1appliancesApplianceidSignalsPostWithHttpInfo(
      applianceid,
      image,
      message,
      name,
      _options
    ).pipe(map((apiResponse: HttpInfo<Signal>) => apiResponse.data));
  }

  /**
   * Send TV signal. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [button] Button name.
   */
  public _1appliancesApplianceidTvPostWithHttpInfo(
    applianceid: string,
    button?: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<TVState>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1appliancesApplianceidTvPost(
      applianceid,
      button,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1appliancesApplianceidTvPostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Send TV signal. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [button] Button name.
   */
  public _1appliancesApplianceidTvPost(
    applianceid: string,
    button?: string,
    _options?: ConfigurationOptions
  ): Observable<TVState> {
    return this._1appliancesApplianceidTvPostWithHttpInfo(applianceid, button, _options).pipe(
      map((apiResponse: HttpInfo<TVState>) => apiResponse.data)
    );
  }

  /**
   * Fetch the list of appliances. Requires basic.read OAuth2 scopes.
   */
  public _1appliancesGetWithHttpInfo(
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<Array<ApplianceResponse>>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1appliancesGet(_config);
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) => this.responseProcessor._1appliancesGetWithHttpInfo(rsp))
          );
        })
      );
  }

  /**
   * Fetch the list of appliances. Requires basic.read OAuth2 scopes.
   */
  public _1appliancesGet(_options?: ConfigurationOptions): Observable<Array<ApplianceResponse>> {
    return this._1appliancesGetWithHttpInfo(_options).pipe(
      map((apiResponse: HttpInfo<Array<ApplianceResponse>>) => apiResponse.data)
    );
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
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<ApplianceResponse>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1appliancesPost(
      device,
      image,
      model,
      modelType,
      nickname,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) => this.responseProcessor._1appliancesPostWithHttpInfo(rsp))
          );
        })
      );
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
    _options?: ConfigurationOptions
  ): Observable<ApplianceResponse> {
    return this._1appliancesPostWithHttpInfo(
      device,
      image,
      model,
      modelType,
      nickname,
      _options
    ).pipe(map((apiResponse: HttpInfo<ApplianceResponse>) => apiResponse.data));
  }

  /**
   * Fetch the list of ble_private_macros. Requires basic.read OAuth2 scopes.
   * @param applianceid Appliance Id
   */
  public _1bleAppliancesApplianceidPrivateMacrosGetWithHttpInfo(
    applianceid: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<Array<BLEPrivateMacroResponse>>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1bleAppliancesApplianceidPrivateMacrosGet(
      applianceid,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1bleAppliancesApplianceidPrivateMacrosGetWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Fetch the list of ble_private_macros. Requires basic.read OAuth2 scopes.
   * @param applianceid Appliance Id
   */
  public _1bleAppliancesApplianceidPrivateMacrosGet(
    applianceid: string,
    _options?: ConfigurationOptions
  ): Observable<Array<BLEPrivateMacroResponse>> {
    return this._1bleAppliancesApplianceidPrivateMacrosGetWithHttpInfo(applianceid, _options).pipe(
      map((apiResponse: HttpInfo<Array<BLEPrivateMacroResponse>>) => apiResponse.data)
    );
  }

  /**
   * Send BLE Private Macro control request. Requires sendir OAuth2 scopes.
   * @param privatemacroid BLE Private Macro ID
   */
  public _1blePrivateMacrosPrivatemacroidExecPostWithHttpInfo(
    privatemacroid: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<any>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1blePrivateMacrosPrivatemacroidExecPost(
      privatemacroid,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1blePrivateMacrosPrivatemacroidExecPostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Send BLE Private Macro control request. Requires sendir OAuth2 scopes.
   * @param privatemacroid BLE Private Macro ID
   */
  public _1blePrivateMacrosPrivatemacroidExecPost(
    privatemacroid: string,
    _options?: ConfigurationOptions
  ): Observable<any> {
    return this._1blePrivateMacrosPrivatemacroidExecPostWithHttpInfo(privatemacroid, _options).pipe(
      map((apiResponse: HttpInfo<any>) => apiResponse.data)
    );
  }

  /**
   * Find the air conditioner best matching the provided infrared signal. Requires detectappliance OAuth2 scopes.
   * @param [device]
   * @param [message] JSON serialized object describing infrared signals. Includes \\\&#39;data\\\&#39;, \\\&#39;freq\\\&#39; and \\\&#39;format\\\&#39; keys.
   */
  public _1detectappliancePostWithHttpInfo(
    device?: string,
    message?: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<Array<ApplianceModelAndParam>>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1detectappliancePost(
      device,
      message,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1detectappliancePostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Find the air conditioner best matching the provided infrared signal. Requires detectappliance OAuth2 scopes.
   * @param [device]
   * @param [message] JSON serialized object describing infrared signals. Includes \\\&#39;data\\\&#39;, \\\&#39;freq\\\&#39; and \\\&#39;format\\\&#39; keys.
   */
  public _1detectappliancePost(
    device?: string,
    message?: string,
    _options?: ConfigurationOptions
  ): Observable<Array<ApplianceModelAndParam>> {
    return this._1detectappliancePostWithHttpInfo(device, message, _options).pipe(
      map((apiResponse: HttpInfo<Array<ApplianceModelAndParam>>) => apiResponse.data)
    );
  }

  /**
   * Fetch the list of appliances registered to the Remo device. Requires basic.read OAuth2 scopes.
   * @param deviceid Device Id
   */
  public _1devicesDeviceidAppliancesGetWithHttpInfo(
    deviceid: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<Array<ApplianceResponse>>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1devicesDeviceidAppliancesGet(
      deviceid,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1devicesDeviceidAppliancesGetWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Fetch the list of appliances registered to the Remo device. Requires basic.read OAuth2 scopes.
   * @param deviceid Device Id
   */
  public _1devicesDeviceidAppliancesGet(
    deviceid: string,
    _options?: ConfigurationOptions
  ): Observable<Array<ApplianceResponse>> {
    return this._1devicesDeviceidAppliancesGetWithHttpInfo(deviceid, _options).pipe(
      map((apiResponse: HttpInfo<Array<ApplianceResponse>>) => apiResponse.data)
    );
  }

  /**
   * Delete a device. Requires basic.write OAuth2 scopes.
   * @param deviceid Device Id
   */
  public _1devicesDeviceidDeletePostWithHttpInfo(
    deviceid: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<any>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1devicesDeviceidDeletePost(
      deviceid,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1devicesDeviceidDeletePostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Delete a device. Requires basic.write OAuth2 scopes.
   * @param deviceid Device Id
   */
  public _1devicesDeviceidDeletePost(
    deviceid: string,
    _options?: ConfigurationOptions
  ): Observable<any> {
    return this._1devicesDeviceidDeletePostWithHttpInfo(deviceid, _options).pipe(
      map((apiResponse: HttpInfo<any>) => apiResponse.data)
    );
  }

  /**
   * Update a device\'s humidity offset. Requires basic.write OAuth2 scopes.
   * @param deviceid Device Id
   * @param [offset] Humidity offset value added to the measured humidity.
   */
  public _1devicesDeviceidHumidityOffsetPostWithHttpInfo(
    deviceid: string,
    offset?: number,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<DeviceResponse>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1devicesDeviceidHumidityOffsetPost(
      deviceid,
      offset,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1devicesDeviceidHumidityOffsetPostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Update a device\'s humidity offset. Requires basic.write OAuth2 scopes.
   * @param deviceid Device Id
   * @param [offset] Humidity offset value added to the measured humidity.
   */
  public _1devicesDeviceidHumidityOffsetPost(
    deviceid: string,
    offset?: number,
    _options?: ConfigurationOptions
  ): Observable<DeviceResponse> {
    return this._1devicesDeviceidHumidityOffsetPostWithHttpInfo(deviceid, offset, _options).pipe(
      map((apiResponse: HttpInfo<DeviceResponse>) => apiResponse.data)
    );
  }

  /**
   * Update a device. Requires basic.write OAuth2 scopes.
   * @param deviceid Device Id
   * @param [name]
   */
  public _1devicesDeviceidPostWithHttpInfo(
    deviceid: string,
    name?: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<DeviceResponse>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1devicesDeviceidPost(
      deviceid,
      name,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1devicesDeviceidPostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Update a device. Requires basic.write OAuth2 scopes.
   * @param deviceid Device Id
   * @param [name]
   */
  public _1devicesDeviceidPost(
    deviceid: string,
    name?: string,
    _options?: ConfigurationOptions
  ): Observable<DeviceResponse> {
    return this._1devicesDeviceidPostWithHttpInfo(deviceid, name, _options).pipe(
      map((apiResponse: HttpInfo<DeviceResponse>) => apiResponse.data)
    );
  }

  /**
   * Update a device\'s temperature offset. Requires basic.write OAuth2 scopes.
   * @param deviceid Device Id
   * @param [offset] Temperature offset value added to the measured temperature.
   */
  public _1devicesDeviceidTemperatureOffsetPostWithHttpInfo(
    deviceid: string,
    offset?: number,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<DeviceResponse>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1devicesDeviceidTemperatureOffsetPost(
      deviceid,
      offset,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1devicesDeviceidTemperatureOffsetPostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Update a device\'s temperature offset. Requires basic.write OAuth2 scopes.
   * @param deviceid Device Id
   * @param [offset] Temperature offset value added to the measured temperature.
   */
  public _1devicesDeviceidTemperatureOffsetPost(
    deviceid: string,
    offset?: number,
    _options?: ConfigurationOptions
  ): Observable<DeviceResponse> {
    return this._1devicesDeviceidTemperatureOffsetPostWithHttpInfo(deviceid, offset, _options).pipe(
      map((apiResponse: HttpInfo<DeviceResponse>) => apiResponse.data)
    );
  }

  /**
   * Fetch the list of Remo devices. Requires basic.read OAuth2 scopes.
   */
  public _1devicesGetWithHttpInfo(
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<Array<DeviceResponse>>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1devicesGet(_config);
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) => this.responseProcessor._1devicesGetWithHttpInfo(rsp))
          );
        })
      );
  }

  /**
   * Fetch the list of Remo devices. Requires basic.read OAuth2 scopes.
   */
  public _1devicesGet(_options?: ConfigurationOptions): Observable<Array<DeviceResponse>> {
    return this._1devicesGetWithHttpInfo(_options).pipe(
      map((apiResponse: HttpInfo<Array<DeviceResponse>>) => apiResponse.data)
    );
  }

  /**
   * Notify Remo E / Remo E lite to refresh one or more ECHONET Lite properties. This endpoint is subject to ECHONET Lite specific rate limiting. See the rate limiting section of the documentation for more details. Requires echonetlite.*.read OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [epc] Comma separated EPCs in hex. eg: cf,da
   */
  public _1echonetliteAppliancesApplianceidRefreshPostWithHttpInfo(
    applianceid: string,
    epc?: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<any>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1echonetliteAppliancesApplianceidRefreshPost(
      applianceid,
      epc,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1echonetliteAppliancesApplianceidRefreshPostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Notify Remo E / Remo E lite to refresh one or more ECHONET Lite properties. This endpoint is subject to ECHONET Lite specific rate limiting. See the rate limiting section of the documentation for more details. Requires echonetlite.*.read OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param [epc] Comma separated EPCs in hex. eg: cf,da
   */
  public _1echonetliteAppliancesApplianceidRefreshPost(
    applianceid: string,
    epc?: string,
    _options?: ConfigurationOptions
  ): Observable<any> {
    return this._1echonetliteAppliancesApplianceidRefreshPostWithHttpInfo(
      applianceid,
      epc,
      _options
    ).pipe(map((apiResponse: HttpInfo<any>) => apiResponse.data));
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
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<any>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1echonetliteAppliancesApplianceidSetPost(
      applianceid,
      epc,
      val,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1echonetliteAppliancesApplianceidSetPostWithHttpInfo(rsp)
            )
          );
        })
      );
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
    _options?: ConfigurationOptions
  ): Observable<any> {
    return this._1echonetliteAppliancesApplianceidSetPostWithHttpInfo(
      applianceid,
      epc,
      val,
      _options
    ).pipe(map((apiResponse: HttpInfo<any>) => apiResponse.data));
  }

  /**
   * Fetch the list of ECHONET Lite appliances. Requires basic.read OAuth2 scopes.
   */
  public _1echonetliteAppliancesGetWithHttpInfo(
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<EchonetLiteApplianceResponse>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1echonetliteAppliancesGet(_config);
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1echonetliteAppliancesGetWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Fetch the list of ECHONET Lite appliances. Requires basic.read OAuth2 scopes.
   */
  public _1echonetliteAppliancesGet(
    _options?: ConfigurationOptions
  ): Observable<EchonetLiteApplianceResponse> {
    return this._1echonetliteAppliancesGetWithHttpInfo(_options).pipe(
      map((apiResponse: HttpInfo<EchonetLiteApplianceResponse>) => apiResponse.data)
    );
  }

  /**
   * Fetch the list of homes. Requires home.read OAuth2 scopes.
   */
  public _1homesGetWithHttpInfo(
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<Array<HomeResponse>>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1homesGet(_config);
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) => this.responseProcessor._1homesGetWithHttpInfo(rsp))
          );
        })
      );
  }

  /**
   * Fetch the list of homes. Requires home.read OAuth2 scopes.
   */
  public _1homesGet(_options?: ConfigurationOptions): Observable<Array<HomeResponse>> {
    return this._1homesGetWithHttpInfo(_options).pipe(
      map((apiResponse: HttpInfo<Array<HomeResponse>>) => apiResponse.data)
    );
  }

  /**
   * Delete a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidDeletePostWithHttpInfo(
    homeid: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<any>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1homesHomeidDeletePost(homeid, _config);
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1homesHomeidDeletePostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Delete a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidDeletePost(homeid: string, _options?: ConfigurationOptions): Observable<any> {
    return this._1homesHomeidDeletePostWithHttpInfo(homeid, _options).pipe(
      map((apiResponse: HttpInfo<any>) => apiResponse.data)
    );
  }

  /**
   * Fetch the list of devices in a home. Requires home.read OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidDevicesGetWithHttpInfo(
    homeid: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<Array<DeviceResponse>>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1homesHomeidDevicesGet(homeid, _config);
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1homesHomeidDevicesGetWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Fetch the list of devices in a home. Requires home.read OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidDevicesGet(
    homeid: string,
    _options?: ConfigurationOptions
  ): Observable<Array<DeviceResponse>> {
    return this._1homesHomeidDevicesGetWithHttpInfo(homeid, _options).pipe(
      map((apiResponse: HttpInfo<Array<DeviceResponse>>) => apiResponse.data)
    );
  }

  /**
   * Create a new home invite. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidInvitesPostWithHttpInfo(
    homeid: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<HomeInvite>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1homesHomeidInvitesPost(homeid, _config);
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1homesHomeidInvitesPostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Create a new home invite. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidInvitesPost(
    homeid: string,
    _options?: ConfigurationOptions
  ): Observable<HomeInvite> {
    return this._1homesHomeidInvitesPostWithHttpInfo(homeid, _options).pipe(
      map((apiResponse: HttpInfo<HomeInvite>) => apiResponse.data)
    );
  }

  /**
   * Kick a user from a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   * @param [user]
   */
  public _1homesHomeidKickPostWithHttpInfo(
    homeid: string,
    user?: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<any>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1homesHomeidKickPost(homeid, user, _config);
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1homesHomeidKickPostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Kick a user from a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   * @param [user]
   */
  public _1homesHomeidKickPost(
    homeid: string,
    user?: string,
    _options?: ConfigurationOptions
  ): Observable<any> {
    return this._1homesHomeidKickPostWithHttpInfo(homeid, user, _options).pipe(
      map((apiResponse: HttpInfo<any>) => apiResponse.data)
    );
  }

  /**
   * Delete a home\'s location. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidLocationDeletePostWithHttpInfo(
    homeid: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<HomeResponse>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1homesHomeidLocationDeletePost(
      homeid,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1homesHomeidLocationDeletePostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Delete a home\'s location. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidLocationDeletePost(
    homeid: string,
    _options?: ConfigurationOptions
  ): Observable<HomeResponse> {
    return this._1homesHomeidLocationDeletePostWithHttpInfo(homeid, _options).pipe(
      map((apiResponse: HttpInfo<HomeResponse>) => apiResponse.data)
    );
  }

  /**
   * Update a home\'s location. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidLocationPostWithHttpInfo(
    homeid: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<HomeResponse>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1homesHomeidLocationPost(homeid, _config);
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1homesHomeidLocationPostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Update a home\'s location. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidLocationPost(
    homeid: string,
    _options?: ConfigurationOptions
  ): Observable<HomeResponse> {
    return this._1homesHomeidLocationPostWithHttpInfo(homeid, _options).pipe(
      map((apiResponse: HttpInfo<HomeResponse>) => apiResponse.data)
    );
  }

  /**
   * Update the user\'s location state for a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidLocationStateUpdatePostWithHttpInfo(
    homeid: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<any>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1homesHomeidLocationStateUpdatePost(
      homeid,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1homesHomeidLocationStateUpdatePostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Update the user\'s location state for a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidLocationStateUpdatePost(
    homeid: string,
    _options?: ConfigurationOptions
  ): Observable<any> {
    return this._1homesHomeidLocationStateUpdatePostWithHttpInfo(homeid, _options).pipe(
      map((apiResponse: HttpInfo<any>) => apiResponse.data)
    );
  }

  /**
   * Change the owner of the home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   * @param [user]
   */
  public _1homesHomeidOwnerPostWithHttpInfo(
    homeid: string,
    user?: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<HomeResponse>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1homesHomeidOwnerPost(homeid, user, _config);
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1homesHomeidOwnerPostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Change the owner of the home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   * @param [user]
   */
  public _1homesHomeidOwnerPost(
    homeid: string,
    user?: string,
    _options?: ConfigurationOptions
  ): Observable<HomeResponse> {
    return this._1homesHomeidOwnerPostWithHttpInfo(homeid, user, _options).pipe(
      map((apiResponse: HttpInfo<HomeResponse>) => apiResponse.data)
    );
  }

  /**
   * Part from a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidPartPostWithHttpInfo(
    homeid: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<any>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1homesHomeidPartPost(homeid, _config);
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1homesHomeidPartPostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Part from a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidPartPost(homeid: string, _options?: ConfigurationOptions): Observable<any> {
    return this._1homesHomeidPartPostWithHttpInfo(homeid, _options).pipe(
      map((apiResponse: HttpInfo<any>) => apiResponse.data)
    );
  }

  /**
   * Update a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   * @param [name]
   */
  public _1homesHomeidPostWithHttpInfo(
    homeid: string,
    name?: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<HomeResponse>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1homesHomeidPost(homeid, name, _config);
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) => this.responseProcessor._1homesHomeidPostWithHttpInfo(rsp))
          );
        })
      );
  }

  /**
   * Update a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   * @param [name]
   */
  public _1homesHomeidPost(
    homeid: string,
    name?: string,
    _options?: ConfigurationOptions
  ): Observable<HomeResponse> {
    return this._1homesHomeidPostWithHttpInfo(homeid, name, _options).pipe(
      map((apiResponse: HttpInfo<HomeResponse>) => apiResponse.data)
    );
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
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<any>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1homesHomeidTransferTohomeidPost(
      homeid,
      tohomeid,
      devices,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1homesHomeidTransferTohomeidPostWithHttpInfo(rsp)
            )
          );
        })
      );
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
    _options?: ConfigurationOptions
  ): Observable<any> {
    return this._1homesHomeidTransferTohomeidPostWithHttpInfo(
      homeid,
      tohomeid,
      devices,
      _options
    ).pipe(map((apiResponse: HttpInfo<any>) => apiResponse.data));
  }

  /**
   * Fetch the list of users in a home. Requires home.read OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidUsersGetWithHttpInfo(
    homeid: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<Array<UserAndRole>>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1homesHomeidUsersGet(homeid, _config);
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1homesHomeidUsersGetWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Fetch the list of users in a home. Requires home.read OAuth2 scopes.
   * @param homeid Home Id
   */
  public _1homesHomeidUsersGet(
    homeid: string,
    _options?: ConfigurationOptions
  ): Observable<Array<UserAndRole>> {
    return this._1homesHomeidUsersGetWithHttpInfo(homeid, _options).pipe(
      map((apiResponse: HttpInfo<Array<UserAndRole>>) => apiResponse.data)
    );
  }

  /**
   * Create a new home. Requires home.write OAuth2 scopes.
   * @param [name]
   */
  public _1homesPostWithHttpInfo(
    name?: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<HomeResponse>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1homesPost(name, _config);
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) => this.responseProcessor._1homesPostWithHttpInfo(rsp))
          );
        })
      );
  }

  /**
   * Create a new home. Requires home.write OAuth2 scopes.
   * @param [name]
   */
  public _1homesPost(name?: string, _options?: ConfigurationOptions): Observable<HomeResponse> {
    return this._1homesPostWithHttpInfo(name, _options).pipe(
      map((apiResponse: HttpInfo<HomeResponse>) => apiResponse.data)
    );
  }

  /**
   * Show a home invite. Requires home.read OAuth2 scopes.
   * @param invitetoken Invite Token
   */
  public _1invitesInvitetokenGetWithHttpInfo(
    invitetoken: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<HomeInvite>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1invitesInvitetokenGet(invitetoken, _config);
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1invitesInvitetokenGetWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Show a home invite. Requires home.read OAuth2 scopes.
   * @param invitetoken Invite Token
   */
  public _1invitesInvitetokenGet(
    invitetoken: string,
    _options?: ConfigurationOptions
  ): Observable<HomeInvite> {
    return this._1invitesInvitetokenGetWithHttpInfo(invitetoken, _options).pipe(
      map((apiResponse: HttpInfo<HomeInvite>) => apiResponse.data)
    );
  }

  /**
   * Accept a home invite. Requires home.write OAuth2 scopes.
   * @param invitetoken Invite Token
   */
  public _1invitesInvitetokenPostWithHttpInfo(
    invitetoken: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<HomeResponse>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1invitesInvitetokenPost(
      invitetoken,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1invitesInvitetokenPostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Accept a home invite. Requires home.write OAuth2 scopes.
   * @param invitetoken Invite Token
   */
  public _1invitesInvitetokenPost(
    invitetoken: string,
    _options?: ConfigurationOptions
  ): Observable<HomeResponse> {
    return this._1invitesInvitetokenPostWithHttpInfo(invitetoken, _options).pipe(
      map((apiResponse: HttpInfo<HomeResponse>) => apiResponse.data)
    );
  }

  /**
   * Delete a signal. Requires basic.write OAuth2 scopes.
   * @param signalid Signal Id
   */
  public _1signalsSignalidDeletePostWithHttpInfo(
    signalid: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<any>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1signalsSignalidDeletePost(
      signalid,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1signalsSignalidDeletePostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Delete a signal. Requires basic.write OAuth2 scopes.
   * @param signalid Signal Id
   */
  public _1signalsSignalidDeletePost(
    signalid: string,
    _options?: ConfigurationOptions
  ): Observable<any> {
    return this._1signalsSignalidDeletePostWithHttpInfo(signalid, _options).pipe(
      map((apiResponse: HttpInfo<any>) => apiResponse.data)
    );
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
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<Signal>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1signalsSignalidPost(
      signalid,
      image,
      name,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1signalsSignalidPostWithHttpInfo(rsp)
            )
          );
        })
      );
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
    _options?: ConfigurationOptions
  ): Observable<Signal> {
    return this._1signalsSignalidPostWithHttpInfo(signalid, image, name, _options).pipe(
      map((apiResponse: HttpInfo<Signal>) => apiResponse.data)
    );
  }

  /**
   * Send a signal. Requires sendir OAuth2 scopes.
   * @param signalid Signal Id
   */
  public _1signalsSignalidSendPostWithHttpInfo(
    signalid: string,
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<any>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1signalsSignalidSendPost(signalid, _config);
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) =>
              this.responseProcessor._1signalsSignalidSendPostWithHttpInfo(rsp)
            )
          );
        })
      );
  }

  /**
   * Send a signal. Requires sendir OAuth2 scopes.
   * @param signalid Signal Id
   */
  public _1signalsSignalidSendPost(
    signalid: string,
    _options?: ConfigurationOptions
  ): Observable<any> {
    return this._1signalsSignalidSendPostWithHttpInfo(signalid, _options).pipe(
      map((apiResponse: HttpInfo<any>) => apiResponse.data)
    );
  }

  /**
   * Fetch the authenticated user\'s information. Requires basic.read OAuth2 scopes.
   */
  public _1usersMeGetWithHttpInfo(
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<UserResponse>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1usersMeGet(_config);
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) => this.responseProcessor._1usersMeGetWithHttpInfo(rsp))
          );
        })
      );
  }

  /**
   * Fetch the authenticated user\'s information. Requires basic.read OAuth2 scopes.
   */
  public _1usersMeGet(_options?: ConfigurationOptions): Observable<UserResponse> {
    return this._1usersMeGetWithHttpInfo(_options).pipe(
      map((apiResponse: HttpInfo<UserResponse>) => apiResponse.data)
    );
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
    _options?: ConfigurationOptions
  ): Observable<HttpInfo<UserResponse>> {
    const _config = mergeConfiguration(this.configuration, _options);

    const requestContextPromise = this.requestFactory._1usersMePost(
      country,
      distanceUnit,
      nickname,
      tempUnit,
      _config
    );
    // build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    for (const middleware of _config.middleware) {
      middlewarePreObservable = middlewarePreObservable.pipe(
        mergeMap((ctx: RequestContext) => middleware.pre(ctx))
      );
    }

    return middlewarePreObservable
      .pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx)))
      .pipe(
        mergeMap((response: ResponseContext) => {
          let middlewarePostObservable = of(response);
          for (const middleware of _config.middleware.reverse()) {
            middlewarePostObservable = middlewarePostObservable.pipe(
              mergeMap((rsp: ResponseContext) => middleware.post(rsp))
            );
          }
          return middlewarePostObservable.pipe(
            map((rsp: ResponseContext) => this.responseProcessor._1usersMePostWithHttpInfo(rsp))
          );
        })
      );
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
    _options?: ConfigurationOptions
  ): Observable<UserResponse> {
    return this._1usersMePostWithHttpInfo(country, distanceUnit, nickname, tempUnit, _options).pipe(
      map((apiResponse: HttpInfo<UserResponse>) => apiResponse.data)
    );
  }
}
