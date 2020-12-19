// @ts-nocheck
import React from 'react';
import { ApplyPluginsType } from '/Users/zoujun/Desktop/ali/yundeng-material/node_modules/_@umijs_runtime@3.3.2@@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
