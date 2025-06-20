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

import { HttpFile } from '../http/http';

export class ApplianceResponseQrioLockDevice {
  id?: number;
  image?: string;
  name?: string;

  static readonly discriminator: string | undefined = undefined;

  static readonly mapping: { [index: string]: string } | undefined = undefined;

  static readonly attributeTypeMap: Array<{
    name: string;
    baseName: string;
    type: string;
    format: string;
  }> = [
    {
      name: 'id',
      baseName: 'id',
      type: 'number',
      format: 'int32'
    },
    {
      name: 'image',
      baseName: 'image',
      type: 'string',
      format: ''
    },
    {
      name: 'name',
      baseName: 'name',
      type: 'string',
      format: ''
    }
  ];

  static getAttributeTypeMap() {
    return ApplianceResponseQrioLockDevice.attributeTypeMap;
  }

  public constructor() {}
}
