import React, { Component } from 'react'
import { Button, message, notification } from 'antd';
import { useIntl } from 'umi';
import defaultSettings from '../config/defaultSettings';
import eventBus from '@/utils/js/EventBus';
import api from '@/utils/axios/Api';
const { pwa } = defaultSettings;
const isHttps = document.location.protocol === 'https:';
Component.prototype.$eventBus = eventBus;
Component.prototype.$API = api;
React.$eventBus = eventBus;
React.$API = api;

String.prototype.colorRgb = function (index=1) {
  // 16进制颜色值的正则
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 把颜色值变成小写
  var color = this.toLowerCase();
  if (reg.test(color)) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    if (color.length === 4) {
      var colorNew = "#";
      for (var i = 1; i < 4; i += 1) {
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
      }
      color = colorNew;
    }
    // 处理六位的颜色值，转为RGB
    var colorChange = [];
    for (var i = 1; i < 7; i += 2) {
      colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
    }
    return "RGB(" + colorChange.join(",") + ","+index+")";
  } else {
    return color;
  }
};

const clearCache = () => {
  // remove all caches
  if (window.caches) {
    caches
      .keys()
      .then((keys) => {
        keys.forEach((key) => {
          caches.delete(key);
        });
      })
      .catch((e) => console.log(e));
  }
}; // if pwa is true

if (pwa) {
  // Notify user if offline now
  window.addEventListener('sw.offline', () => {
    message.warning(
      useIntl().formatMessage({
        id: 'app.pwa.offline',
      }),
    );
  }); // Pop up a prompt on the page asking the user if they want to use the latest version

  window.addEventListener('sw.updated', (event) => {
    const e = event;

    const reloadSW = async () => {
      // Check if there is sw whose state is waiting in ServiceWorkerRegistration
      // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
      const worker = e.detail && e.detail.waiting;

      if (!worker) {
        return true;
      } // Send skip-waiting event to waiting SW with MessageChannel

      await new Promise((resolve, reject) => {
        const channel = new MessageChannel();

        channel.port1.onmessage = (msgEvent) => {
          if (msgEvent.data.error) {
            reject(msgEvent.data.error);
          } else {
            resolve(msgEvent.data);
          }
        };

        worker.postMessage(
          {
            type: 'skip-waiting',
          },
          [channel.port2],
        );
      });
      clearCache();
      window.location.reload();
      return true;
    };

    const key = `open${Date.now()}`;
    const btn = (
      <Button
        type="primary"
        onClick={() => {
          notification.close(key);
          reloadSW();
        }}
      >
        {useIntl().formatMessage({
          id: 'app.pwa.serviceworker.updated.ok',
        })}
      </Button>
    );
    notification.open({
      message: useIntl().formatMessage({
        id: 'app.pwa.serviceworker.updated',
      }),
      description: useIntl().formatMessage({
        id: 'app.pwa.serviceworker.updated.hint',
      }),
      btn,
      key,
      onClose: async () => null,
    });
  });
} else if ('serviceWorker' in navigator && isHttps) {
  // unregister service worker
  const { serviceWorker } = navigator;

  if (serviceWorker.getRegistrations) {
    serviceWorker.getRegistrations().then((sws) => {
      sws.forEach((sw) => {
        sw.unregister();
      });
    });
  }

  serviceWorker.getRegistration().then((sw) => {
    if (sw) sw.unregister();
  });
  clearCache();
}