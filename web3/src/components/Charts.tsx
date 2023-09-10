import { Chart } from 'chart.js/auto';
import React, { useEffect, useRef, useState } from 'react';
import { Client as RpcClient } from 'rpc-websockets';

let bottomPrice;
let topPrice;
let chart;

const Charts = () => {
  const refChart = useRef();
  const [price, setPrice] = useState<number>(0);
  const initChart = (initPrice) => {
    const delta = (initPrice * 0.01) / 100;
    bottomPrice = initPrice - delta;
    topPrice = initPrice + delta;

    const data = {
      labels: [Date.now()],
      datasets: [
        {
          label: 'Real Price',
          data: [initPrice],
          fill: true,
          borderWidth: 3,
          borderColor: 'yellow',
          pointBackgroundColor: 'yellow',
          tension: 0.1,
          datalabels: {
            align: function (context) {
              return context.active ? 'start' : 'center';
            },
          },
        },
        {
          label: '',
          data: [initPrice],
          backgroundColor: 'red',
          fill: true,
          borderWidth: 1,
          borderColor: 'yellow',
          pointBackgroundColor: 'yellow',
        },
        {
          label: '',
          data: [bottomPrice],
          backgroundColor: 'transparent',
          borderColor: 'rgba(152,222,217,0.2)',
          fill: true,
          borderWidth: 0,
        },
        {
          label: '',
          data: [topPrice],
          backgroundColor: 'green',
          borderColor: 'rgba(152,222,217,0.2)',
          fill: true,
          borderWidth: 0,
          pointRadius: 0,
        },
      ],
    };

    var options: any = {
      maintainAspectRatio: false,
      animation: {
        duration: 2,
      },
      scales: {
        x: {
          ticks: {
            display: false,
          },
        },
      },
    };

    chart = new Chart('chartBTC', {
      type: 'line',
      options: options,
      data: data,
    });
  };

  function removeData() {
    if (!chart) return;
    chart.data.labels.shift();
    chart.data.datasets.forEach((dataset) => {
      dataset.data.shift();
    });
  }

  const updateLineData = (line, newValue) => {
    for (let i = 0; i < line.length; i++) {
      line[i] = newValue;
    }
  };

  const addData = (time, value) => {
    if (!chart) return;

    const realPriceList = chart.data.datasets[0].data;
    const startPriceList = chart.data.datasets[1].data;
    const bottomPriceList = chart.data.datasets[2].data;
    const topPriceList = chart.data.datasets[3].data;
    const delta = (value * 0.01) / 100;

    if (value < bottomPrice) {
      bottomPrice = value - delta;
      topPrice = value - delta;
    }
    if (value > topPrice) {
      bottomPrice = value + delta;
      topPrice = value + delta;
    }

    updateLineData(bottomPriceList, bottomPrice);
    updateLineData(topPriceList, topPrice);
    updateLineData(startPriceList, value);

    chart.data.labels.push(time);
    chart.data.datasets.forEach((dataset, index) => {
      if (index === 0) {
        dataset.data.push(value);
      } else {
        dataset.data.push(dataset.data[0] ?? value);
      }
    });

    if (chart.data.datasets[0].data.length > 60) {
      removeData();
    }

    chart.update();
  };

  useEffect(() => {
    // instantiate Client and connect to an RPC server
    var ws = new RpcClient('wss://wss.dezens.io');
    // var ws = new RpcClient('ws://localhost:7001');

    ws.on('open', function () {
      // subscribe to receive an event
      ws.subscribe('feed_updated');

      ws.call('get_current_market', ['BTCBUSD']).then((data) => {
        console.log('get_current_market', data);
      });

      ws.on('feed_updated', function (data) {
        setPrice(data.price);
        if (!bottomPrice) {
          bottomPrice = data.price;
          initChart(data.price);
        } else {
          addData(data.timestamp, data.price);
        }
      });
    });
  }, []);
  return <canvas id="chartBTC" ref={refChart} />;
};

export { Charts };
