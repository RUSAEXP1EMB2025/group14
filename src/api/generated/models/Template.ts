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

export class Template {
  image?: string;
  label?: string;
  name?: string;
  templates?: Array<Template>;
  text?: string;
  type?: string;
  uuid?: string;
  xSize?: number;
  ySize?: number;

  static readonly discriminator: string | undefined = undefined;

  static readonly mapping: { [index: string]: string } | undefined = undefined;

  static readonly attributeTypeMap: Array<{
    name: string;
    baseName: string;
    type: string;
    format: string;
  }> = [
    {
      name: 'image',
      baseName: 'image',
      type: 'string',
      format: ''
    },
    {
      name: 'label',
      baseName: 'label',
      type: 'string',
      format: ''
    },
    {
      name: 'name',
      baseName: 'name',
      type: 'string',
      format: ''
    },
    {
      name: 'templates',
      baseName: 'templates',
      type: 'Array<Template>',
      format: ''
    },
    {
      name: 'text',
      baseName: 'text',
      type: 'string',
      format: ''
    },
    {
      name: 'type',
      baseName: 'type',
      type: 'string',
      format: ''
    },
    {
      name: 'uuid',
      baseName: 'uuid',
      type: 'string',
      format: ''
    },
    {
      name: 'xSize',
      baseName: 'x_size',
      type: 'number',
      format: ''
    },
    {
      name: 'ySize',
      baseName: 'y_size',
      type: 'number',
      format: ''
    }
  ];

  static getAttributeTypeMap() {
    return Template.attributeTypeMap;
  }

  public constructor() {}
}
