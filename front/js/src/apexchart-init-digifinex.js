//open h  l  c
//digif _,close,high,low,open

const digifinexAPIBaseURL = "https://openapi.digifinex.com/v3";

const difinexChartReuesetData = [
  {
    method: "GET",
    requestURL: "/kline?symbol=xrun_btc&period=60",
    drawDOM: {
      func: DrawToMainPage_3ColChart,
      DomId: "HourChart",
    },
  },
  {
    method: "GET",
    requestURL: "/kline?symbol=xrun_btc&period=1D",
    drawDOM: {
      func: DrawToMainPage_3ColChart,
      DomId: "DayChart",
    },
  },
  {
    method: "GET",
    requestURL: "/kline?symbol=xrun_btc&period=1W",
    drawDOM: {
      func: DrawToMainPage_3ColChart,
      DomId: "WeekChart",
    },
  },
  {
    method: "GET",
    requestURL: "/kline?symbol=xrun_btc&period=60",
    drawDOM: {
      func: DrawToMainPage_12ColChart,
      DomId: "MainChart",
    },
  },
];
// 메인 , detail_{} , account_List 페이지 그래프 추가 메소드
difinexChartReuesetData.forEach(
  ({ method, requestURL, drawDOM: { func, DomId } }) => {
    callxhrDigifinexAPI(method, requestURL)
      .then(response => {
        func({ data: response.data, DomId });
      })
      .catch(error => {
        console.log(error);
      });
  }
);

function callxhrDigifinexAPI(method, requetsAddresss, data = null) {
  return new Promise((res, rej) => {
    const XHR = new XMLHttpRequest();
    XHR.open(method, `${digifinexAPIBaseURL}${requetsAddresss}`);
    XHR.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded; charset=UTF-8"
    );
    XHR.send();
    if (method === "POST") {
      console.log("준비 중입니다.");
      rej("준비 중입니다.");
    } else {
      XHR.onreadystatechange = target => {
        if (XHR.status === 200 && XHR.response) {
          res(JSON.parse(XHR.response));
        }
      };
    }
  });
}
function DrawToMainPage_3ColChart({ data, DomId }) {
  const resultData = data.map(v => {
    const [x, , close, ,] = v;
    return close;
  });
  var options = {
    chart: {
      height: 100,
      type: "line",
      zoom: {
        enabled: false,
      },

      toolbar: {
        show: false,
      },
    },
    series: [
      {
        name: "Desktops",
        data: resultData,
      },
    ],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: ["#7391FF"],
    },
    grid: {
      show: false,
    },
    tooltip: {
      enabled: false,
      x: {
        format: "dd MMM yyyy",
      },
    },
    xaxis: {
      show: false,
      axisBorder: {
        show: false,
      },
      labels: {
        show: false,
      },
    },
    yaxis: {
      tickAmount: 2,
      min: min => {
        min = Math.min(...options["series"][0]["data"]);
        return min;
      },
      max: max => {
        max = Math.max(...options["series"][0]["data"]);
        return max;
      },
    },
  };
  var chart = new ApexCharts(document.getElementById(DomId), options);
  chart.render();
}
function DrawToMainPage_12ColChart({ data, DomId }) {
  const parseData = data.reduce((prev, cur) => {
    const [x, _, close, high, low, open] = cur;
    const obj = {
      x,
      y: [open, high, low, close],
    };
    prev.push(obj);
    return prev;
  }, []);
  var options = {
    series: [
      {
        name: "candle",
        data: [...parseData],
      },
    ],
    chart: {
      height: 350,
      type: "candlestick",
    },
    title: {
      text: "Digifinex XRUN Chart",
      align: "left",
    },
    annotations: {
      xaxis: [
        {
          borderColor: "#00E396",
          label: {
            borderColor: "#00E396",
            style: {
              fontSize: "12px",
              color: "#fff",
              background: "#00E396",
            },
            orientation: "horizontal",
            offsetY: 7,
            text: "Annotation Test",
          },
        },
      ],
    },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      // type: "category",
      type: "numeric",
      labels: {
        formatter: function (val) {
          return dayjs(val).format("MMM DD HH:mm");
        },
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };
  var chart = new ApexCharts(document.getElementById(DomId), options);
  chart.render();
}
