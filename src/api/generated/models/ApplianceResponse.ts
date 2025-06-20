/**
 * Nature API
 * Read/Write Nature Remo
 *
 * OpenAPI spec version: 2.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { ApplianceResponseAircon } from '../models/ApplianceResponseAircon';
import { ApplianceResponseAirconSmartEcoMode } from '../models/ApplianceResponseAirconSmartEcoMode';
import { ApplianceResponseBle } from '../models/ApplianceResponseBle';
import { ApplianceResponseDevice } from '../models/ApplianceResponseDevice';
import { ApplianceResponseEchonetlite } from '../models/ApplianceResponseEchonetlite';
import { ApplianceResponseLight } from '../models/ApplianceResponseLight';
import { ApplianceResponseLightProjector } from '../models/ApplianceResponseLightProjector';
import { ApplianceResponseMorninPlus } from '../models/ApplianceResponseMorninPlus';
import { ApplianceResponseQrioLock } from '../models/ApplianceResponseQrioLock';
import { ApplianceResponseSettings } from '../models/ApplianceResponseSettings';
import { ApplianceResponseSignalsInner } from '../models/ApplianceResponseSignalsInner';
import { ApplianceResponseSmartMeter } from '../models/ApplianceResponseSmartMeter';
import { ApplianceResponseTv } from '../models/ApplianceResponseTv';
import { HttpFile } from '../http/http';

export class ApplianceResponse {
  aircon?: ApplianceResponseAircon;
  airconSmartEcoMode?: ApplianceResponseAirconSmartEcoMode;
  ble?: ApplianceResponseBle;
  device?: ApplianceResponseDevice;
  echonetlite?: ApplianceResponseEchonetlite;
  id?: string;
  image?: string;
  light?: ApplianceResponseLight;
  lightProjector?: ApplianceResponseLightProjector;
  model?: any | null;
  morninPlus?: ApplianceResponseMorninPlus;
  nickname?: string;
  qrioLock?: ApplianceResponseQrioLock;
  settings?: ApplianceResponseSettings;
  signals?: Array<ApplianceResponseSignalsInner>;
  smartMeter?: ApplianceResponseSmartMeter;
  tv?: ApplianceResponseTv;
  /**
   * Appliance types. AC, TV, LIGHT, etc.
   */
  type?: string;

  static readonly discriminator: string | undefined = undefined;

  static readonly mapping: { [index: string]: string } | undefined = undefined;

  static readonly attributeTypeMap: Array<{
    name: string;
    baseName: string;
    type: string;
    format: string;
  }> = [
    {
      name: 'aircon',
      baseName: 'aircon',
      type: 'ApplianceResponseAircon',
      format: ''
    },
    {
      name: 'airconSmartEcoMode',
      baseName: 'aircon_smart_eco_mode',
      type: 'ApplianceResponseAirconSmartEcoMode',
      format: ''
    },
    {
      name: 'ble',
      baseName: 'ble',
      type: 'ApplianceResponseBle',
      format: ''
    },
    {
      name: 'device',
      baseName: 'device',
      type: 'ApplianceResponseDevice',
      format: ''
    },
    {
      name: 'echonetlite',
      baseName: 'echonetlite',
      type: 'ApplianceResponseEchonetlite',
      format: ''
    },
    {
      name: 'id',
      baseName: 'id',
      type: 'string',
      format: ''
    },
    {
      name: 'image',
      baseName: 'image',
      type: 'string',
      format: ''
    },
    {
      name: 'light',
      baseName: 'light',
      type: 'ApplianceResponseLight',
      format: ''
    },
    {
      name: 'lightProjector',
      baseName: 'light_projector',
      type: 'ApplianceResponseLightProjector',
      format: ''
    },
    {
      name: 'model',
      baseName: 'model',
      type: 'any',
      format: ''
    },
    {
      name: 'morninPlus',
      baseName: 'mornin_plus',
      type: 'ApplianceResponseMorninPlus',
      format: ''
    },
    {
      name: 'nickname',
      baseName: 'nickname',
      type: 'string',
      format: ''
    },
    {
      name: 'qrioLock',
      baseName: 'qrio_lock',
      type: 'ApplianceResponseQrioLock',
      format: ''
    },
    {
      name: 'settings',
      baseName: 'settings',
      type: 'ApplianceResponseSettings',
      format: ''
    },
    {
      name: 'signals',
      baseName: 'signals',
      type: 'Array<ApplianceResponseSignalsInner>',
      format: ''
    },
    {
      name: 'smartMeter',
      baseName: 'smart_meter',
      type: 'ApplianceResponseSmartMeter',
      format: ''
    },
    {
      name: 'tv',
      baseName: 'tv',
      type: 'ApplianceResponseTv',
      format: ''
    },
    {
      name: 'type',
      baseName: 'type',
      type: 'string',
      format: ''
    }
  ];

  static getAttributeTypeMap() {
    return ApplianceResponse.attributeTypeMap;
  }

  public constructor() {}
}
