// TODO: better import syntax?
import { BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo } from '../http/http';
import { ObjectSerializer } from '../models/ObjectSerializer';
import { ApiException } from './exception';
import { canConsumeForm, isCodeInRange } from '../util';
import { SecurityAuthentication } from '../auth/auth';

import { AirconSettingsResponse } from '../models/AirconSettingsResponse';
import { ApplianceModelAndParam } from '../models/ApplianceModelAndParam';
import { ApplianceResponse } from '../models/ApplianceResponse';
import { BLEPrivateMacroResponse } from '../models/BLEPrivateMacroResponse';
import { DeviceResponse } from '../models/DeviceResponse';
import { EchonetLiteApplianceResponse } from '../models/EchonetLiteApplianceResponse';
import { HomeInvite } from '../models/HomeInvite';
import { HomeResponse } from '../models/HomeResponse';
import { LightState } from '../models/LightState';
import { Signal } from '../models/Signal';
import { TVState } from '../models/TVState';
import { UserAndRole } from '../models/UserAndRole';
import { UserResponse } from '../models/UserResponse';

/**
 * no description
 */
export class DefaultApiRequestFactory extends BaseAPIRequestFactory {
  /**
   * Reorder appliances. Requires basic.write OAuth2 scopes.
   * @param appliances List of all appliance IDs, comma separated.
   */
  public async _1applianceOrdersPost(
    appliances?: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // Path Params
    const localVarPath = '/1/appliance_orders';

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (appliances !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('appliances', appliances as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Update air conditioner settings. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param airDirection AC air direction. Empty means automatic.
   * @param airDirectionH AC horizontal air direction.
   * @param airVolume AC air volume. Empty means automatic. Numbers express the amount of volume. The range of AirVolumes which the air conditioner accepts depends on the air conditioner model and operation mode. Check the \\\&#39;AirConRangeMode\\\&#39; information in the response for the range of the particular air conditioner model and operation mode.
   * @param button Button. Specify \\\&#39;power-off\\\&#39; always if you want the air conditioner powered off. Empty means powered on.
   * @param operationMode AC operation mode. The range of operation modes which the air conditioner accepts depends on the air conditioner model. Check the \\\&#39;AirConRangeMode\\\&#39; information in the response for the range of the particular air conditioner model.
   * @param temperature Temperature. The temperature in string format. The unit is described in Aircon object. The range of Temperatures which the air conditioner accepts depends on the air conditioner model and operation mode. Check the \\\&#39;AirConRangeMode\\\&#39; information in the response for the range of the particular air conditioner model and operation mode.
   * @param temperatureUnit Temperature unit. \\\&#39;c\\\&#39; or \\\&#39;f\\\&#39; or \\\&#39;\\\&#39; for unknown.
   */
  public async _1appliancesApplianceidAirconSettingsPost(
    applianceid: string,
    airDirection?: string,
    airDirectionH?: string,
    airVolume?: string,
    button?: string,
    operationMode?: string,
    temperature?: string,
    temperatureUnit?: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'applianceid' is not null or undefined
    if (applianceid === null || applianceid === undefined) {
      throw new RequiredError(
        'DefaultApi',
        '_1appliancesApplianceidAirconSettingsPost',
        'applianceid'
      );
    }

    // Path Params
    const localVarPath = '/1/appliances/{applianceid}/aircon_settings'.replace(
      '{' + 'applianceid' + '}',
      encodeURIComponent(String(applianceid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (airDirection !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('air_direction', airDirection as any);
    }
    if (airDirectionH !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('air_direction_h', airDirectionH as any);
    }
    if (airVolume !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('air_volume', airVolume as any);
    }
    if (button !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('button', button as any);
    }
    if (operationMode !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('operation_mode', operationMode as any);
    }
    if (temperature !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('temperature', temperature as any);
    }
    if (temperatureUnit !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('temperature_unit', temperatureUnit as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Delete an appliance. Requires basic.write OAuth2 scopes.
   * @param applianceid Appliance Id
   */
  public async _1appliancesApplianceidDeletePost(
    applianceid: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'applianceid' is not null or undefined
    if (applianceid === null || applianceid === undefined) {
      throw new RequiredError('DefaultApi', '_1appliancesApplianceidDeletePost', 'applianceid');
    }

    // Path Params
    const localVarPath = '/1/appliances/{applianceid}/delete'.replace(
      '{' + 'applianceid' + '}',
      encodeURIComponent(String(applianceid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Send light signal. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param button Button name.
   */
  public async _1appliancesApplianceidLightPost(
    applianceid: string,
    button?: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'applianceid' is not null or undefined
    if (applianceid === null || applianceid === undefined) {
      throw new RequiredError('DefaultApi', '_1appliancesApplianceidLightPost', 'applianceid');
    }

    // Path Params
    const localVarPath = '/1/appliances/{applianceid}/light'.replace(
      '{' + 'applianceid' + '}',
      encodeURIComponent(String(applianceid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (button !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('button', button as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Send light_projector signal. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param button Button name.
   */
  public async _1appliancesApplianceidLightProjectorPost(
    applianceid: string,
    button?: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'applianceid' is not null or undefined
    if (applianceid === null || applianceid === undefined) {
      throw new RequiredError(
        'DefaultApi',
        '_1appliancesApplianceidLightProjectorPost',
        'applianceid'
      );
    }

    // Path Params
    const localVarPath = '/1/appliances/{applianceid}/light_projector'.replace(
      '{' + 'applianceid' + '}',
      encodeURIComponent(String(applianceid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (button !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('button', button as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Update an appliance. Requires basic.write OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param image Basename of the image file included in the app. Ex: \\\&#39;ico_ac_1\\\&#39;.
   * @param nickname Appliance name.
   */
  public async _1appliancesApplianceidPost(
    applianceid: string,
    image?: string,
    nickname?: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'applianceid' is not null or undefined
    if (applianceid === null || applianceid === undefined) {
      throw new RequiredError('DefaultApi', '_1appliancesApplianceidPost', 'applianceid');
    }

    // Path Params
    const localVarPath = '/1/appliances/{applianceid}'.replace(
      '{' + 'applianceid' + '}',
      encodeURIComponent(String(applianceid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (image !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('image', image as any);
    }
    if (nickname !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('nickname', nickname as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Send SESAME bot click request. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   */
  public async _1appliancesApplianceidSesameBotClickPost(
    applianceid: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'applianceid' is not null or undefined
    if (applianceid === null || applianceid === undefined) {
      throw new RequiredError(
        'DefaultApi',
        '_1appliancesApplianceidSesameBotClickPost',
        'applianceid'
      );
    }

    // Path Params
    const localVarPath = '/1/appliances/{applianceid}/sesame_bot/click'.replace(
      '{' + 'applianceid' + '}',
      encodeURIComponent(String(applianceid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Reorder signals. Requires basic.write OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param signals List of all signal IDs, comma separated.
   */
  public async _1appliancesApplianceidSignalOrdersPost(
    applianceid: string,
    signals?: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'applianceid' is not null or undefined
    if (applianceid === null || applianceid === undefined) {
      throw new RequiredError(
        'DefaultApi',
        '_1appliancesApplianceidSignalOrdersPost',
        'applianceid'
      );
    }

    // Path Params
    const localVarPath = '/1/appliances/{applianceid}/signal_orders'.replace(
      '{' + 'applianceid' + '}',
      encodeURIComponent(String(applianceid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (signals !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('signals', signals as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Fetch the list of signals. Requires basic.read OAuth2 scopes.
   * @param applianceid Appliance Id
   */
  public async _1appliancesApplianceidSignalsGet(
    applianceid: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'applianceid' is not null or undefined
    if (applianceid === null || applianceid === undefined) {
      throw new RequiredError('DefaultApi', '_1appliancesApplianceidSignalsGet', 'applianceid');
    }

    // Path Params
    const localVarPath = '/1/appliances/{applianceid}/signals'.replace(
      '{' + 'applianceid' + '}',
      encodeURIComponent(String(applianceid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Create a new signal. Requires basic.write OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param image Basename of the image file included in the app. Ex: \\\&#39;ico_io\\\&#39;.
   * @param message JSON serialized object describing infrared signals. Includes \\\&#39;data\\\&#39;, \\\&#39;freq\\\&#39; and \\\&#39;format\\\&#39; keys.
   * @param name Signal name.
   */
  public async _1appliancesApplianceidSignalsPost(
    applianceid: string,
    image?: string,
    message?: string,
    name?: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'applianceid' is not null or undefined
    if (applianceid === null || applianceid === undefined) {
      throw new RequiredError('DefaultApi', '_1appliancesApplianceidSignalsPost', 'applianceid');
    }

    // Path Params
    const localVarPath = '/1/appliances/{applianceid}/signals'.replace(
      '{' + 'applianceid' + '}',
      encodeURIComponent(String(applianceid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (image !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('image', image as any);
    }
    if (message !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('message', message as any);
    }
    if (name !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('name', name as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Send TV signal. Requires sendir OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param button Button name.
   */
  public async _1appliancesApplianceidTvPost(
    applianceid: string,
    button?: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'applianceid' is not null or undefined
    if (applianceid === null || applianceid === undefined) {
      throw new RequiredError('DefaultApi', '_1appliancesApplianceidTvPost', 'applianceid');
    }

    // Path Params
    const localVarPath = '/1/appliances/{applianceid}/tv'.replace(
      '{' + 'applianceid' + '}',
      encodeURIComponent(String(applianceid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (button !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('button', button as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Fetch the list of appliances. Requires basic.read OAuth2 scopes.
   */
  public async _1appliancesGet(_options?: Configuration): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // Path Params
    const localVarPath = '/1/appliances';

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Create a new appliance. Requires basic.write OAuth2 scopes.
   * @param device
   * @param image Basename of the image file included in the app. Ex: \\\&#39;ico_ac_1\\\&#39;.
   * @param model ApplianceModel ID if the appliance we\\\&#39;re trying to create is included in IRDB.
   * @param modelType Enum of \\\&#39;AC\\\&#39;, \\\&#39;TV\\\&#39;, \\\&#39;Light\\\&#39;
   * @param nickname Appliance name.
   */
  public async _1appliancesPost(
    device?: string,
    image?: string,
    model?: string,
    modelType?: string,
    nickname?: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // Path Params
    const localVarPath = '/1/appliances';

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (device !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('device', device as any);
    }
    if (image !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('image', image as any);
    }
    if (model !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('model', model as any);
    }
    if (modelType !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('model_type', modelType as any);
    }
    if (nickname !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('nickname', nickname as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Fetch the list of ble_private_macros. Requires basic.read OAuth2 scopes.
   * @param applianceid Appliance Id
   */
  public async _1bleAppliancesApplianceidPrivateMacrosGet(
    applianceid: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'applianceid' is not null or undefined
    if (applianceid === null || applianceid === undefined) {
      throw new RequiredError(
        'DefaultApi',
        '_1bleAppliancesApplianceidPrivateMacrosGet',
        'applianceid'
      );
    }

    // Path Params
    const localVarPath = '/1/ble/appliances/{applianceid}/private_macros'.replace(
      '{' + 'applianceid' + '}',
      encodeURIComponent(String(applianceid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Send BLE Private Macro control request. Requires sendir OAuth2 scopes.
   * @param privatemacroid BLE Private Macro ID
   */
  public async _1blePrivateMacrosPrivatemacroidExecPost(
    privatemacroid: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'privatemacroid' is not null or undefined
    if (privatemacroid === null || privatemacroid === undefined) {
      throw new RequiredError(
        'DefaultApi',
        '_1blePrivateMacrosPrivatemacroidExecPost',
        'privatemacroid'
      );
    }

    // Path Params
    const localVarPath = '/1/ble/private_macros/{privatemacroid}/exec'.replace(
      '{' + 'privatemacroid' + '}',
      encodeURIComponent(String(privatemacroid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Find the air conditioner best matching the provided infrared signal. Requires detectappliance OAuth2 scopes.
   * @param device
   * @param message JSON serialized object describing infrared signals. Includes \\\&#39;data\\\&#39;, \\\&#39;freq\\\&#39; and \\\&#39;format\\\&#39; keys.
   */
  public async _1detectappliancePost(
    device?: string,
    message?: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // Path Params
    const localVarPath = '/1/detectappliance';

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (device !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('Device', device as any);
    }
    if (message !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('Message', message as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Fetch the list of appliances registered to the Remo device. Requires basic.read OAuth2 scopes.
   * @param deviceid Device Id
   */
  public async _1devicesDeviceidAppliancesGet(
    deviceid: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'deviceid' is not null or undefined
    if (deviceid === null || deviceid === undefined) {
      throw new RequiredError('DefaultApi', '_1devicesDeviceidAppliancesGet', 'deviceid');
    }

    // Path Params
    const localVarPath = '/1/devices/{deviceid}/appliances'.replace(
      '{' + 'deviceid' + '}',
      encodeURIComponent(String(deviceid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Delete a device. Requires basic.write OAuth2 scopes.
   * @param deviceid Device Id
   */
  public async _1devicesDeviceidDeletePost(
    deviceid: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'deviceid' is not null or undefined
    if (deviceid === null || deviceid === undefined) {
      throw new RequiredError('DefaultApi', '_1devicesDeviceidDeletePost', 'deviceid');
    }

    // Path Params
    const localVarPath = '/1/devices/{deviceid}/delete'.replace(
      '{' + 'deviceid' + '}',
      encodeURIComponent(String(deviceid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Update a device\'s humidity offset. Requires basic.write OAuth2 scopes.
   * @param deviceid Device Id
   * @param offset Humidity offset value added to the measured humidity.
   */
  public async _1devicesDeviceidHumidityOffsetPost(
    deviceid: string,
    offset?: number,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'deviceid' is not null or undefined
    if (deviceid === null || deviceid === undefined) {
      throw new RequiredError('DefaultApi', '_1devicesDeviceidHumidityOffsetPost', 'deviceid');
    }

    // Path Params
    const localVarPath = '/1/devices/{deviceid}/humidity_offset'.replace(
      '{' + 'deviceid' + '}',
      encodeURIComponent(String(deviceid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (offset !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('offset', offset as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Update a device. Requires basic.write OAuth2 scopes.
   * @param deviceid Device Id
   * @param name
   */
  public async _1devicesDeviceidPost(
    deviceid: string,
    name?: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'deviceid' is not null or undefined
    if (deviceid === null || deviceid === undefined) {
      throw new RequiredError('DefaultApi', '_1devicesDeviceidPost', 'deviceid');
    }

    // Path Params
    const localVarPath = '/1/devices/{deviceid}'.replace(
      '{' + 'deviceid' + '}',
      encodeURIComponent(String(deviceid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (name !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('name', name as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Update a device\'s temperature offset. Requires basic.write OAuth2 scopes.
   * @param deviceid Device Id
   * @param offset Temperature offset value added to the measured temperature.
   */
  public async _1devicesDeviceidTemperatureOffsetPost(
    deviceid: string,
    offset?: number,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'deviceid' is not null or undefined
    if (deviceid === null || deviceid === undefined) {
      throw new RequiredError('DefaultApi', '_1devicesDeviceidTemperatureOffsetPost', 'deviceid');
    }

    // Path Params
    const localVarPath = '/1/devices/{deviceid}/temperature_offset'.replace(
      '{' + 'deviceid' + '}',
      encodeURIComponent(String(deviceid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (offset !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('offset', offset as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Fetch the list of Remo devices. Requires basic.read OAuth2 scopes.
   */
  public async _1devicesGet(_options?: Configuration): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // Path Params
    const localVarPath = '/1/devices';

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Notify Remo E / Remo E lite to refresh one or more ECHONET Lite properties. This endpoint is subject to ECHONET Lite specific rate limiting. See the rate limiting section of the documentation for more details. Requires echonetlite.*.read OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param epc Comma separated EPCs in hex. eg: cf,da
   */
  public async _1echonetliteAppliancesApplianceidRefreshPost(
    applianceid: string,
    epc?: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'applianceid' is not null or undefined
    if (applianceid === null || applianceid === undefined) {
      throw new RequiredError(
        'DefaultApi',
        '_1echonetliteAppliancesApplianceidRefreshPost',
        'applianceid'
      );
    }

    // Path Params
    const localVarPath = '/1/echonetlite/appliances/{applianceid}/refresh'.replace(
      '{' + 'applianceid' + '}',
      encodeURIComponent(String(applianceid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (epc !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('epc', epc as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Set one ECHONET Lite property. This endpoint is subject to ECHONET Lite specific rate limiting. See the rate limiting section of the documentation for more details. Requires echonetlite.*.write OAuth2 scopes.
   * @param applianceid Appliance Id
   * @param epc EPC in hex string. eg: cf
   * @param val Value in hex string. String length must be 2x the number of bytes according to ECHONET Lite spec, and filled with zero if necessary. eg: 000000FF
   */
  public async _1echonetliteAppliancesApplianceidSetPost(
    applianceid: string,
    epc?: string,
    val?: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'applianceid' is not null or undefined
    if (applianceid === null || applianceid === undefined) {
      throw new RequiredError(
        'DefaultApi',
        '_1echonetliteAppliancesApplianceidSetPost',
        'applianceid'
      );
    }

    // Path Params
    const localVarPath = '/1/echonetlite/appliances/{applianceid}/set'.replace(
      '{' + 'applianceid' + '}',
      encodeURIComponent(String(applianceid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (epc !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('epc', epc as any);
    }
    if (val !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('val', val as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Fetch the list of ECHONET Lite appliances. Requires basic.read OAuth2 scopes.
   */
  public async _1echonetliteAppliancesGet(_options?: Configuration): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // Path Params
    const localVarPath = '/1/echonetlite/appliances';

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Fetch the list of homes. Requires home.read OAuth2 scopes.
   */
  public async _1homesGet(_options?: Configuration): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // Path Params
    const localVarPath = '/1/homes';

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Delete a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public async _1homesHomeidDeletePost(
    homeid: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'homeid' is not null or undefined
    if (homeid === null || homeid === undefined) {
      throw new RequiredError('DefaultApi', '_1homesHomeidDeletePost', 'homeid');
    }

    // Path Params
    const localVarPath = '/1/homes/{homeid}/delete'.replace(
      '{' + 'homeid' + '}',
      encodeURIComponent(String(homeid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Fetch the list of devices in a home. Requires home.read OAuth2 scopes.
   * @param homeid Home Id
   */
  public async _1homesHomeidDevicesGet(
    homeid: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'homeid' is not null or undefined
    if (homeid === null || homeid === undefined) {
      throw new RequiredError('DefaultApi', '_1homesHomeidDevicesGet', 'homeid');
    }

    // Path Params
    const localVarPath = '/1/homes/{homeid}/devices'.replace(
      '{' + 'homeid' + '}',
      encodeURIComponent(String(homeid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Create a new home invite. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public async _1homesHomeidInvitesPost(
    homeid: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'homeid' is not null or undefined
    if (homeid === null || homeid === undefined) {
      throw new RequiredError('DefaultApi', '_1homesHomeidInvitesPost', 'homeid');
    }

    // Path Params
    const localVarPath = '/1/homes/{homeid}/invites'.replace(
      '{' + 'homeid' + '}',
      encodeURIComponent(String(homeid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Kick a user from a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   * @param user
   */
  public async _1homesHomeidKickPost(
    homeid: string,
    user?: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'homeid' is not null or undefined
    if (homeid === null || homeid === undefined) {
      throw new RequiredError('DefaultApi', '_1homesHomeidKickPost', 'homeid');
    }

    // Path Params
    const localVarPath = '/1/homes/{homeid}/kick'.replace(
      '{' + 'homeid' + '}',
      encodeURIComponent(String(homeid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (user !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('user', user as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Delete a home\'s location. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public async _1homesHomeidLocationDeletePost(
    homeid: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'homeid' is not null or undefined
    if (homeid === null || homeid === undefined) {
      throw new RequiredError('DefaultApi', '_1homesHomeidLocationDeletePost', 'homeid');
    }

    // Path Params
    const localVarPath = '/1/homes/{homeid}/location/delete'.replace(
      '{' + 'homeid' + '}',
      encodeURIComponent(String(homeid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Update a home\'s location. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public async _1homesHomeidLocationPost(
    homeid: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'homeid' is not null or undefined
    if (homeid === null || homeid === undefined) {
      throw new RequiredError('DefaultApi', '_1homesHomeidLocationPost', 'homeid');
    }

    // Path Params
    const localVarPath = '/1/homes/{homeid}/location'.replace(
      '{' + 'homeid' + '}',
      encodeURIComponent(String(homeid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Update the user\'s location state for a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public async _1homesHomeidLocationStateUpdatePost(
    homeid: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'homeid' is not null or undefined
    if (homeid === null || homeid === undefined) {
      throw new RequiredError('DefaultApi', '_1homesHomeidLocationStateUpdatePost', 'homeid');
    }

    // Path Params
    const localVarPath = '/1/homes/{homeid}/location_state/update'.replace(
      '{' + 'homeid' + '}',
      encodeURIComponent(String(homeid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Change the owner of the home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   * @param user
   */
  public async _1homesHomeidOwnerPost(
    homeid: string,
    user?: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'homeid' is not null or undefined
    if (homeid === null || homeid === undefined) {
      throw new RequiredError('DefaultApi', '_1homesHomeidOwnerPost', 'homeid');
    }

    // Path Params
    const localVarPath = '/1/homes/{homeid}/owner'.replace(
      '{' + 'homeid' + '}',
      encodeURIComponent(String(homeid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (user !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('user', user as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Part from a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   */
  public async _1homesHomeidPartPost(
    homeid: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'homeid' is not null or undefined
    if (homeid === null || homeid === undefined) {
      throw new RequiredError('DefaultApi', '_1homesHomeidPartPost', 'homeid');
    }

    // Path Params
    const localVarPath = '/1/homes/{homeid}/part'.replace(
      '{' + 'homeid' + '}',
      encodeURIComponent(String(homeid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Update a home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   * @param name
   */
  public async _1homesHomeidPost(
    homeid: string,
    name?: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'homeid' is not null or undefined
    if (homeid === null || homeid === undefined) {
      throw new RequiredError('DefaultApi', '_1homesHomeidPost', 'homeid');
    }

    // Path Params
    const localVarPath = '/1/homes/{homeid}'.replace(
      '{' + 'homeid' + '}',
      encodeURIComponent(String(homeid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (name !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('name', name as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Transfer devices to another home. Requires home.write OAuth2 scopes.
   * @param homeid Home Id
   * @param tohomeid Transfer to Home Id
   * @param devices
   */
  public async _1homesHomeidTransferTohomeidPost(
    homeid: string,
    tohomeid: string,
    devices?: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'homeid' is not null or undefined
    if (homeid === null || homeid === undefined) {
      throw new RequiredError('DefaultApi', '_1homesHomeidTransferTohomeidPost', 'homeid');
    }

    // verify required parameter 'tohomeid' is not null or undefined
    if (tohomeid === null || tohomeid === undefined) {
      throw new RequiredError('DefaultApi', '_1homesHomeidTransferTohomeidPost', 'tohomeid');
    }

    // Path Params
    const localVarPath = '/1/homes/{homeid}/transfer/{tohomeid}'
      .replace('{' + 'homeid' + '}', encodeURIComponent(String(homeid)))
      .replace('{' + 'tohomeid' + '}', encodeURIComponent(String(tohomeid)));

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (devices !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('devices', devices as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Fetch the list of users in a home. Requires home.read OAuth2 scopes.
   * @param homeid Home Id
   */
  public async _1homesHomeidUsersGet(
    homeid: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'homeid' is not null or undefined
    if (homeid === null || homeid === undefined) {
      throw new RequiredError('DefaultApi', '_1homesHomeidUsersGet', 'homeid');
    }

    // Path Params
    const localVarPath = '/1/homes/{homeid}/users'.replace(
      '{' + 'homeid' + '}',
      encodeURIComponent(String(homeid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Create a new home. Requires home.write OAuth2 scopes.
   * @param name
   */
  public async _1homesPost(name?: string, _options?: Configuration): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // Path Params
    const localVarPath = '/1/homes';

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (name !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('name', name as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Show a home invite. Requires home.read OAuth2 scopes.
   * @param invitetoken Invite Token
   */
  public async _1invitesInvitetokenGet(
    invitetoken: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'invitetoken' is not null or undefined
    if (invitetoken === null || invitetoken === undefined) {
      throw new RequiredError('DefaultApi', '_1invitesInvitetokenGet', 'invitetoken');
    }

    // Path Params
    const localVarPath = '/1/invites/{invitetoken}'.replace(
      '{' + 'invitetoken' + '}',
      encodeURIComponent(String(invitetoken))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Accept a home invite. Requires home.write OAuth2 scopes.
   * @param invitetoken Invite Token
   */
  public async _1invitesInvitetokenPost(
    invitetoken: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'invitetoken' is not null or undefined
    if (invitetoken === null || invitetoken === undefined) {
      throw new RequiredError('DefaultApi', '_1invitesInvitetokenPost', 'invitetoken');
    }

    // Path Params
    const localVarPath = '/1/invites/{invitetoken}'.replace(
      '{' + 'invitetoken' + '}',
      encodeURIComponent(String(invitetoken))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Delete a signal. Requires basic.write OAuth2 scopes.
   * @param signalid Signal Id
   */
  public async _1signalsSignalidDeletePost(
    signalid: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'signalid' is not null or undefined
    if (signalid === null || signalid === undefined) {
      throw new RequiredError('DefaultApi', '_1signalsSignalidDeletePost', 'signalid');
    }

    // Path Params
    const localVarPath = '/1/signals/{signalid}/delete'.replace(
      '{' + 'signalid' + '}',
      encodeURIComponent(String(signalid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Update a signal. Requires basic.write OAuth2 scopes.
   * @param signalid Signal Id
   * @param image Basename of the image file included in the app. Ex: \\\&#39;ico_io\\\&#39;.
   * @param name Signal name.
   */
  public async _1signalsSignalidPost(
    signalid: string,
    image?: string,
    name?: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'signalid' is not null or undefined
    if (signalid === null || signalid === undefined) {
      throw new RequiredError('DefaultApi', '_1signalsSignalidPost', 'signalid');
    }

    // Path Params
    const localVarPath = '/1/signals/{signalid}'.replace(
      '{' + 'signalid' + '}',
      encodeURIComponent(String(signalid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (image !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('image', image as any);
    }
    if (name !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('name', name as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Send a signal. Requires sendir OAuth2 scopes.
   * @param signalid Signal Id
   */
  public async _1signalsSignalidSendPost(
    signalid: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // verify required parameter 'signalid' is not null or undefined
    if (signalid === null || signalid === undefined) {
      throw new RequiredError('DefaultApi', '_1signalsSignalidSendPost', 'signalid');
    }

    // Path Params
    const localVarPath = '/1/signals/{signalid}/send'.replace(
      '{' + 'signalid' + '}',
      encodeURIComponent(String(signalid))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Fetch the authenticated user\'s information. Requires basic.read OAuth2 scopes.
   */
  public async _1usersMeGet(_options?: Configuration): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // Path Params
    const localVarPath = '/1/users/me';

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }

  /**
   * Update authenticated user\'s information. Requires basic.write OAuth2 scopes.
   * @param country
   * @param distanceUnit
   * @param nickname
   * @param tempUnit
   */
  public async _1usersMePost(
    country?: string,
    distanceUnit?: string,
    nickname?: string,
    tempUnit?: string,
    _options?: Configuration
  ): Promise<RequestContext> {
    let _config = _options || this.configuration;

    // Path Params
    const localVarPath = '/1/users/me';

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
    requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

    // Form Params
    const useForm = canConsumeForm(['application/x-www-form-urlencoded']);

    let localVarFormParams;
    if (useForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new URLSearchParams();
    }

    if (country !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('country', country as any);
    }
    if (distanceUnit !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('distance_unit', distanceUnit as any);
    }
    if (nickname !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('nickname', nickname as any);
    }
    if (tempUnit !== undefined) {
      // TODO: replace .append with .set
      localVarFormParams.append('temp_unit', tempUnit as any);
    }

    requestContext.setBody(localVarFormParams);

    if (!useForm) {
      const contentType = ObjectSerializer.getPreferredMediaType([
        'application/x-www-form-urlencoded'
      ]);
      requestContext.setHeaderParam('Content-Type', contentType);
    }

    let authMethod: SecurityAuthentication | undefined;
    // Apply auth methods
    authMethod = _config.authMethods['oauth2'];
    if (authMethod?.applySecurityAuthentication) {
      await authMethod?.applySecurityAuthentication(requestContext);
    }

    const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default;
    if (defaultAuth?.applySecurityAuthentication) {
      await defaultAuth?.applySecurityAuthentication(requestContext);
    }

    return requestContext;
  }
}

export class DefaultApiResponseProcessor {
  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1applianceOrdersPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1applianceOrdersPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<any>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1appliancesApplianceidAirconSettingsPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1appliancesApplianceidAirconSettingsPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<AirconSettingsResponse>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: AirconSettingsResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'AirconSettingsResponse',
        ''
      ) as AirconSettingsResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: AirconSettingsResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'AirconSettingsResponse',
        ''
      ) as AirconSettingsResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1appliancesApplianceidDeletePost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1appliancesApplianceidDeletePostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<any>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1appliancesApplianceidLightPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1appliancesApplianceidLightPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<LightState>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: LightState = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'LightState',
        ''
      ) as LightState;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: LightState = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'LightState',
        ''
      ) as LightState;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1appliancesApplianceidLightProjectorPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1appliancesApplianceidLightProjectorPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<any>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1appliancesApplianceidPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1appliancesApplianceidPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<ApplianceResponse>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: ApplianceResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'ApplianceResponse',
        ''
      ) as ApplianceResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: ApplianceResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'ApplianceResponse',
        ''
      ) as ApplianceResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1appliancesApplianceidSesameBotClickPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1appliancesApplianceidSesameBotClickPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<any>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1appliancesApplianceidSignalOrdersPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1appliancesApplianceidSignalOrdersPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<any>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1appliancesApplianceidSignalsGet
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1appliancesApplianceidSignalsGetWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<Array<Signal>>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: Array<Signal> = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Array<Signal>',
        ''
      ) as Array<Signal>;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: Array<Signal> = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Array<Signal>',
        ''
      ) as Array<Signal>;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1appliancesApplianceidSignalsPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1appliancesApplianceidSignalsPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<Signal>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: Signal = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Signal',
        ''
      ) as Signal;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: Signal = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Signal',
        ''
      ) as Signal;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1appliancesApplianceidTvPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1appliancesApplianceidTvPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<TVState>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: TVState = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'TVState',
        ''
      ) as TVState;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: TVState = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'TVState',
        ''
      ) as TVState;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1appliancesGet
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1appliancesGetWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<Array<ApplianceResponse>>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: Array<ApplianceResponse> = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Array<ApplianceResponse>',
        ''
      ) as Array<ApplianceResponse>;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: Array<ApplianceResponse> = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Array<ApplianceResponse>',
        ''
      ) as Array<ApplianceResponse>;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1appliancesPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1appliancesPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<ApplianceResponse>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: ApplianceResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'ApplianceResponse',
        ''
      ) as ApplianceResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: ApplianceResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'ApplianceResponse',
        ''
      ) as ApplianceResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1bleAppliancesApplianceidPrivateMacrosGet
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1bleAppliancesApplianceidPrivateMacrosGetWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<Array<BLEPrivateMacroResponse>>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: Array<BLEPrivateMacroResponse> = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Array<BLEPrivateMacroResponse>',
        ''
      ) as Array<BLEPrivateMacroResponse>;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: Array<BLEPrivateMacroResponse> = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Array<BLEPrivateMacroResponse>',
        ''
      ) as Array<BLEPrivateMacroResponse>;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1blePrivateMacrosPrivatemacroidExecPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1blePrivateMacrosPrivatemacroidExecPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<any>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1detectappliancePost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1detectappliancePostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<Array<ApplianceModelAndParam>>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: Array<ApplianceModelAndParam> = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Array<ApplianceModelAndParam>',
        ''
      ) as Array<ApplianceModelAndParam>;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: Array<ApplianceModelAndParam> = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Array<ApplianceModelAndParam>',
        ''
      ) as Array<ApplianceModelAndParam>;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1devicesDeviceidAppliancesGet
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1devicesDeviceidAppliancesGetWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<Array<ApplianceResponse>>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: Array<ApplianceResponse> = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Array<ApplianceResponse>',
        ''
      ) as Array<ApplianceResponse>;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: Array<ApplianceResponse> = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Array<ApplianceResponse>',
        ''
      ) as Array<ApplianceResponse>;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1devicesDeviceidDeletePost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1devicesDeviceidDeletePostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<any>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1devicesDeviceidHumidityOffsetPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1devicesDeviceidHumidityOffsetPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<DeviceResponse>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: DeviceResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'DeviceResponse',
        ''
      ) as DeviceResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: DeviceResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'DeviceResponse',
        ''
      ) as DeviceResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1devicesDeviceidPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1devicesDeviceidPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<DeviceResponse>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: DeviceResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'DeviceResponse',
        ''
      ) as DeviceResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: DeviceResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'DeviceResponse',
        ''
      ) as DeviceResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1devicesDeviceidTemperatureOffsetPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1devicesDeviceidTemperatureOffsetPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<DeviceResponse>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: DeviceResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'DeviceResponse',
        ''
      ) as DeviceResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: DeviceResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'DeviceResponse',
        ''
      ) as DeviceResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1devicesGet
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1devicesGetWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<Array<DeviceResponse>>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: Array<DeviceResponse> = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Array<DeviceResponse>',
        ''
      ) as Array<DeviceResponse>;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: Array<DeviceResponse> = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Array<DeviceResponse>',
        ''
      ) as Array<DeviceResponse>;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1echonetliteAppliancesApplianceidRefreshPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1echonetliteAppliancesApplianceidRefreshPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<any>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('202', response.httpStatusCode)) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1echonetliteAppliancesApplianceidSetPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1echonetliteAppliancesApplianceidSetPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<any>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('202', response.httpStatusCode)) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1echonetliteAppliancesGet
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1echonetliteAppliancesGetWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<EchonetLiteApplianceResponse>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: EchonetLiteApplianceResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'EchonetLiteApplianceResponse',
        ''
      ) as EchonetLiteApplianceResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: EchonetLiteApplianceResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'EchonetLiteApplianceResponse',
        ''
      ) as EchonetLiteApplianceResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1homesGet
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1homesGetWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<Array<HomeResponse>>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: Array<HomeResponse> = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Array<HomeResponse>',
        ''
      ) as Array<HomeResponse>;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: Array<HomeResponse> = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Array<HomeResponse>',
        ''
      ) as Array<HomeResponse>;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1homesHomeidDeletePost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1homesHomeidDeletePostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<any>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1homesHomeidDevicesGet
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1homesHomeidDevicesGetWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<Array<DeviceResponse>>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: Array<DeviceResponse> = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Array<DeviceResponse>',
        ''
      ) as Array<DeviceResponse>;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: Array<DeviceResponse> = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Array<DeviceResponse>',
        ''
      ) as Array<DeviceResponse>;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1homesHomeidInvitesPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1homesHomeidInvitesPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<HomeInvite>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: HomeInvite = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'HomeInvite',
        ''
      ) as HomeInvite;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: HomeInvite = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'HomeInvite',
        ''
      ) as HomeInvite;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1homesHomeidKickPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1homesHomeidKickPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<any>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1homesHomeidLocationDeletePost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1homesHomeidLocationDeletePostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<HomeResponse>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: HomeResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'HomeResponse',
        ''
      ) as HomeResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: HomeResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'HomeResponse',
        ''
      ) as HomeResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1homesHomeidLocationPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1homesHomeidLocationPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<HomeResponse>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: HomeResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'HomeResponse',
        ''
      ) as HomeResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: HomeResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'HomeResponse',
        ''
      ) as HomeResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1homesHomeidLocationStateUpdatePost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1homesHomeidLocationStateUpdatePostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<any>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1homesHomeidOwnerPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1homesHomeidOwnerPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<HomeResponse>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: HomeResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'HomeResponse',
        ''
      ) as HomeResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: HomeResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'HomeResponse',
        ''
      ) as HomeResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1homesHomeidPartPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1homesHomeidPartPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<any>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1homesHomeidPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1homesHomeidPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<HomeResponse>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: HomeResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'HomeResponse',
        ''
      ) as HomeResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: HomeResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'HomeResponse',
        ''
      ) as HomeResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1homesHomeidTransferTohomeidPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1homesHomeidTransferTohomeidPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<any>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1homesHomeidUsersGet
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1homesHomeidUsersGetWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<Array<UserAndRole>>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: Array<UserAndRole> = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Array<UserAndRole>',
        ''
      ) as Array<UserAndRole>;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: Array<UserAndRole> = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Array<UserAndRole>',
        ''
      ) as Array<UserAndRole>;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1homesPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1homesPostWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HomeResponse>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: HomeResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'HomeResponse',
        ''
      ) as HomeResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: HomeResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'HomeResponse',
        ''
      ) as HomeResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1invitesInvitetokenGet
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1invitesInvitetokenGetWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<HomeInvite>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: HomeInvite = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'HomeInvite',
        ''
      ) as HomeInvite;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: HomeInvite = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'HomeInvite',
        ''
      ) as HomeInvite;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1invitesInvitetokenPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1invitesInvitetokenPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<HomeResponse>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: HomeResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'HomeResponse',
        ''
      ) as HomeResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: HomeResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'HomeResponse',
        ''
      ) as HomeResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1signalsSignalidDeletePost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1signalsSignalidDeletePostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<any>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1signalsSignalidPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1signalsSignalidPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<Signal>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: Signal = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Signal',
        ''
      ) as Signal;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: Signal = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'Signal',
        ''
      ) as Signal;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1signalsSignalidSendPost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1signalsSignalidSendPostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<any>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: any = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'any',
        ''
      ) as any;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1usersMeGet
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1usersMeGetWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<UserResponse>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: UserResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'UserResponse',
        ''
      ) as UserResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: UserResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'UserResponse',
        ''
      ) as UserResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to _1usersMePost
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async _1usersMePostWithHttpInfo(
    response: ResponseContext
  ): Promise<HttpInfo<UserResponse>> {
    const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
    if (isCodeInRange('200', response.httpStatusCode)) {
      const body: UserResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'UserResponse',
        ''
      ) as UserResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: UserResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        'UserResponse',
        ''
      ) as UserResponse;
      return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      'Unknown API Status Code!',
      await response.getBodyAsAny(),
      response.headers
    );
  }
}
