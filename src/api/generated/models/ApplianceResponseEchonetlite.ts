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

import { ApplianceResponseEchonetliteGetPropertiesValue } from '../models/ApplianceResponseEchonetliteGetPropertiesValue';
import { ApplianceResponseEchonetliteLocalize } from '../models/ApplianceResponseEchonetliteLocalize';
import { HttpFile } from '../http/http';

/**
 * The ECHONET lite properties fetched from the appliance. See \'Detailed Requirements for ECHONET Device Objects\' for more details. ref. https://echonet.jp/spec_object_rl_en/
 */
export class ApplianceResponseEchonetlite {
  getProperties?: { [key: string]: ApplianceResponseEchonetliteGetPropertiesValue };
  identifier?: string;
  instance?: string;
  ip?: string;
  localize?: ApplianceResponseEchonetliteLocalize;
  routeType?: string;
  setProperties?: { [key: string]: ApplianceResponseEchonetliteGetPropertiesValue };
  state?: any | null;
  version?: string;

  static readonly discriminator: string | undefined = undefined;

  static readonly mapping: { [index: string]: string } | undefined = undefined;

  static readonly attributeTypeMap: Array<{
    name: string;
    baseName: string;
    type: string;
    format: string;
  }> = [
    {
      name: 'getProperties',
      baseName: 'get_properties',
      type: '{ [key: string]: ApplianceResponseEchonetliteGetPropertiesValue; }',
      format: ''
    },
    {
      name: 'identifier',
      baseName: 'identifier',
      type: 'string',
      format: ''
    },
    {
      name: 'instance',
      baseName: 'instance',
      type: 'string',
      format: ''
    },
    {
      name: 'ip',
      baseName: 'ip',
      type: 'string',
      format: ''
    },
    {
      name: 'localize',
      baseName: 'localize',
      type: 'ApplianceResponseEchonetliteLocalize',
      format: ''
    },
    {
      name: 'routeType',
      baseName: 'route_type',
      type: 'string',
      format: ''
    },
    {
      name: 'setProperties',
      baseName: 'set_properties',
      type: '{ [key: string]: ApplianceResponseEchonetliteGetPropertiesValue; }',
      format: ''
    },
    {
      name: 'state',
      baseName: 'state',
      type: 'any',
      format: ''
    },
    {
      name: 'version',
      baseName: 'version',
      type: 'string',
      format: ''
    }
  ];

  static getAttributeTypeMap() {
    return ApplianceResponseEchonetlite.attributeTypeMap;
  }

  public constructor() {}
}
