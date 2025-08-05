import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "github-markdown-css";
import * as echarts from 'echarts';

const richMarkdownContent = `
# 一级标题：Markdown 丰富示例 [[1,'我是1的id']]

## 二级标题：Markdown 丰富示例 [[2,'我是2的id']]

### 三级标题：Markdown 丰富示例 [[3,'我是3的id']]
<div style="display:flex">
<div id="echarts-container-1" style="width: 600px; height: 400px;"></div>
<div id="echarts-container-2" style="width: 600px; height: 400px;"></div>
</div>
`;

const replaceReferences = (str) => {
    // 定义正则表达式
    const regex = /\[\[(\d+),'(.*?)'\]\]/g;

    // 使用 replace 方法进行全局替换
    return str.replace(regex, (match, num, id) => {
        return `<sup className="text-blue-600 cursor-pointer" data-supid="${id}">[${num}]</sup>`;
    });
}

const regStr = replaceReferences(richMarkdownContent);

// 自定义渲染器
const components = {
    sup: ({ children, ...rest }) => {
        return (
            <sup className="text-active" onClick={(event) => handleSupClick(event)} {...rest}>
                {children}
            </sup>
        );
    },
};

// 点击事件处理函数
const handleSupClick = (event) => {
    const supid = event.target.dataset.supid;
    console.log("Clicked sup data-supid:", supid);
    // 你可以在这里进行其他操作，比如将内容传递给父组件等
};

const App = () => {
    const chartRef1 = useRef(null);
    const chartRef2 = useRef(null);

    useEffect(() => {
        // 获取第一个 ECharts 容器元素
        const chartContainer1 = document.getElementById('echarts-container-1');
        if (chartContainer1) {
            // 初始化第一个 ECharts 实例
            const myChart1 = echarts.init(chartContainer1);

            // 第一个图表的配置项和数据
            const option1 = {
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line'
                }]
            };

            // 使用刚指定的配置项和数据显示第一个图表。
            myChart1.setOption(option1);

            // 组件卸载时销毁第一个 ECharts 实例
            return () => {
                myChart1.dispose();
            };
        }
    }, []);

    useEffect(() => {
        // 获取第二个 ECharts 容器元素
        const chartContainer2 = document.getElementById('echarts-container-2');
        if (chartContainer2) {
            // 初始化第二个 ECharts 实例
            const myChart2 = echarts.init(chartContainer2);

            // 第二个图表的配置项和数据
            const option2 = {
                xAxis: {
                    type: 'category',
                    data: ['A', 'B', 'C', 'D', 'E']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [300, 400, 200, 500, 100],
                    type: 'bar'
                }]
            };

            // 使用刚指定的配置项和数据显示第二个图表。
            myChart2.setOption(option2);

            // 组件卸载时销毁第二个 ECharts 实例
            return () => {
                myChart2.dispose();
            };
        }
    }, []);

    return (
        <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
                {regStr}
            </ReactMarkdown>
        </div>
    );
};

export default App;