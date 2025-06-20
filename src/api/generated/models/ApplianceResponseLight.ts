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

import { ApplianceResponseLightButtonsInner } from '../models/ApplianceResponseLightButtonsInner';
import { ApplianceResponseLightState } from '../models/ApplianceResponseLightState';
import { HttpFile } from '../http/http';

export class ApplianceResponseLight {
  buttons?: Array<ApplianceResponseLightButtonsInner>;
  state?: ApplianceResponseLightState;

  static readonly discriminator: string | undefined = undefined;

  static readonly mapping: { [index: string]: string } | undefined = undefined;

  static readonly attributeTypeMap: Array<{
    name: string;
    baseName: string;
    type: string;
    format: string;
  }> = [
    {
      name: 'buttons',
      baseName: 'buttons',
      type: 'Array<ApplianceResponseLightButtonsInner>',
      format: ''
    },
    {
      name: 'state',
      baseName: 'state',
      type: 'ApplianceResponseLightState',
      format: ''
    }
  ];

  static getAttributeTypeMap() {
    return ApplianceResponseLight.attributeTypeMap;
  }

  public constructor() {}
}
