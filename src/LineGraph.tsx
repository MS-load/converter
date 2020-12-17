import React from 'react'
import Chart from "chart.js"


interface Props {
    toCurrency: string,
    fromCurrency: string
}

interface State {
    today: string,
    lastMonth: string,
    values: number[],
    tags: string[],
    
    
}

export default class LineGraph extends React.Component<Props, State>{
    constructor(props: Props) {

        super(props)
        let today = new Date()

        this.state = {
            today: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),

            lastMonth: today.getFullYear() + '-' + (today.getMonth()) + '-' + today.getDate(),

            values: [],
            tags: []


        }
    }

    chartRef = React.createRef() as any

    componentDidMount() {
        console.log('MOUNT')
        this.fetchData()
    }

    cssVar(name: string) {
        return getComputedStyle(document.documentElement).getPropertyValue(name);
    }

    fetchData() {
        fetch(`https://api.exchangeratesapi.io/history?start_at=${this.state.lastMonth}&end_at=${this.state.today}&base=${this.props.fromCurrency}`)
            .then(res =>

                res.json()
            )
            .then(data => {
                let rates: any[] = Object.values(data.rates)

                const values: number[] = []
                for (const rate of rates) {
                    values.push(rate[this.props.toCurrency])
                }
                this.setState({ values: values, tags: this.getLabel(values) })


            }).catch(error => {
                console.log(error)

            })
    }

    getLabel(values: number[]) {
        const test: string[] = []
        for (const item of values) {
            test.push('.')
        }
        test.splice(0, 2)
        test.unshift(this.state.lastMonth)
        test.push(this.state.today)
        return test
    }


    componentDidUpdate(prevProps: Props, prevState: State) {
        console.log('UPDATE')
        if (this.props.toCurrency !== prevProps.toCurrency || this.props.fromCurrency !== prevProps.fromCurrency) {
            this.fetchData()
        }
        if (JSON.stringify(this.state.values) !== JSON.stringify(prevState.values)) {
            const myChartRef = this.chartRef.current.getContext("2d")
            new Chart(myChartRef, {
                type: "line",

                data: {
                    labels: this.state.tags,

                    datasets: [

                        {

                            label: "Exchange Rates",
                            data: this.state.values,
                            backgroundColor: "rgba(0, 100, 0, 0.5)",
                            borderColor: "rgba(0, 100, 0, 1)",
                            borderWidth: 3,
                            pointBackgroundColor: this.cssVar('--primaryText'),

                            pointRadius: 5,

                            pointBorderWidth: 2,

                        }
                    ]
                },
                options: {
                    events: ['null'],
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            boxWidth: 80,
                            fontColor: this.cssVar('--primaryText')
                        }
                    },
                    scales: {
                        xAxes: [{
                            gridLines: {
                                color: this.cssVar('--primaryText')
                            },
                            scaleLabel: {
                                display: false,
                                labelString: "Days",

                            },
                            ticks: {
                                fontColor: this.cssVar('--primaryText'),
                                fontStyle: "bold",
                            }
                        }],
                        yAxes: [{
                            gridLines: {
                                color: this.cssVar('--primaryText'),
                            },
                            scaleLabel: {
                                display: true,
                                labelString: `${this.props.fromCurrency} vs ${this.props.toCurrency}`,
                                fontColor: this.cssVar('--primaryText'),
                                fontStyle: "bold",
                            },
                            ticks: {
                                fontColor: this.cssVar('--primaryText'),
                                fontStyle: "bold",
                            }
                        }]
                    }
                }
            })
        }
    }

    render() {
        return (
            <div>
                <canvas style={canvasStyle}
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}

const canvasStyle: React.CSSProperties = {
    width: '100%',
}