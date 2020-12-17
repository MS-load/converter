import React from 'react'
import CurrencyRow from './CurrencyRow'
import Flag from './Flag'
import SyncIcon from '@material-ui/icons/Sync'
import EUR from './assets/EUR.svg'
import LineGraph from './LineGraph'
import Image from './Image'
import artWork from "./assets/18920.png"
import Favorite from './Favorite'
interface Props {
    displayPage: string
}

interface State {
    error: null
    isLoaded: boolean
    amountInFromCurrency: boolean
    options: string[]
    fromCurrency: string
    toCurrency: string
    amount: number
    exchangeRate: number
    fromFlag: string
    toFlag: string
}

export default class CurrencyOptions extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            error: null,
            isLoaded: false,
            amountInFromCurrency: true,
            options: [],
            fromCurrency: '',
            toCurrency: '',
            amount: 1,
            exchangeRate: 1,
            fromFlag: '',
            toFlag: '',
        }
    }

    async componentDidMount() {
        try {
            const responses = await Promise.all([
                fetch(`https://api.exchangeratesapi.io/latest`),
                fetch('https://restcountries.eu/rest/v2/all?fields=name;currencies;flag')])
            const dataArray = await Promise.all(responses.map((res) => res.json()))
            const defaultCurrency = await Object.keys(dataArray[0].rates)[0]

            await this.setState({
                isLoaded: true,
                fromCurrency: dataArray[0].base,
                toCurrency: defaultCurrency,
                options: [...Object.keys(dataArray[0].rates), dataArray[0].base],
                exchangeRate: (dataArray[0].rates[defaultCurrency]),
            })

            await this.setState({
                fromFlag: this.currency2flag(this.state.fromCurrency, dataArray[1]),
                toFlag: this.currency2flag(this.state.toCurrency, dataArray[1])
            })

        }
        catch (error) {
            this.setState({
                isLoaded: true,
                error
            })
            console.log(error);
        }
    }

    currency2flag(currency: string, dataSet: any[]) {
        let flag;
        switch (currency) {
            case 'AUD':
                flag = dataSet.find((element: { name: string }) => element.name === 'Australia').flag
                break;
            case 'USD':
                flag = (dataSet.find((element: { name: string }) => element.name === 'United States of America')).flag
                break;
            case 'CHF':
                flag = dataSet.find((element: { name: string }) => element.name === 'Switzerland').flag
                break;
            case 'SGD':
                flag = dataSet.find((element: { name: string }) => element.name === 'Singapore').flag
                break;
            case 'EUR':
                flag = EUR
                break;
            default:
                flag = dataSet.find((element: { currencies: { code: string }[] }) => element.currencies[0].code === currency).flag
        }
        return flag
    }

    handleClick(event: { preventDefault: () => void }) {
        event.preventDefault()
        this.setState({
            fromCurrency: this.state.toCurrency,
            toCurrency: this.state.fromCurrency
        })
    }

    async update(fromCurrency: string, toCurrency: string) {
        if (fromCurrency === 'EUR' && toCurrency === 'EUR') {
            this.setState({
                exchangeRate: 1,
                fromFlag: EUR,
                toFlag: EUR
            })
        }
        else {
            try {
                const responses = await Promise.all([
                    fetch(`https://api.exchangeratesapi.io/latest?base=${fromCurrency}&symbols=${toCurrency}`),
                    fetch('https://restcountries.eu/rest/v2/all?fields=name;currencies;flag')])
                const dataArray = await Promise.all(responses.map((res) => res.json()))
                if (fromCurrency === 'EUR' && toCurrency === 'EUR') {
                    this.setState({
                        exchangeRate: 1,
                        fromFlag: this.currency2flag(fromCurrency, dataArray[1]),
                        toFlag: this.currency2flag(toCurrency, dataArray[1])
                    })
                }
                this.setState({
                    exchangeRate: (dataArray[0].rates[toCurrency]),
                    fromFlag: this.currency2flag(fromCurrency, dataArray[1]),
                    toFlag: this.currency2flag(toCurrency, dataArray[1])
                })
            } catch (error) {
                this.setState({
                    isLoaded: true,
                    error
                })
                console.log(error)
            }
        }
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        console.log('UPDATE')
        if (this.state.toCurrency !== prevState.toCurrency || this.state.fromCurrency !== prevState.fromCurrency) {
            this.update(this.state.fromCurrency, this.state.toCurrency)
        }

    }

    changeCurrency = (event: { target: { name: string; value: string } }) => {
        if (event.target.name === "from") {
            this.setState({ fromCurrency: event.target.value })
        }
        if (event.target.name === "to") {
            this.setState({ toCurrency: event.target.value })
        }
    }

    changeAmount = (event: { target: { name: string; value: number } }) => {
        if (event.target.name === "fromInput") {
            this.setState({
                amount: event.target.value,
                amountInFromCurrency: true
            })
        }
        if (event.target.name === "toInput") {
            this.setState({
                amount: event.target.value,
                amountInFromCurrency: false
            })
        }
    }

    showFav = (event: any) => {
        this.setState({
            fromCurrency: event.target.getAttribute('data-fromcurrency'),
            toCurrency: event.target.getAttribute('data-tocurrency')
        })
        
        
    }

    changeDisplayPage = (value: string) => {
        if (value === 'fav') {
            return <Favorite
                currencyTranslations={[{ fromCurrency: this.state.fromCurrency, toCurrency: this.state.toCurrency }]}
                showFav={(event) => this.showFav(event)} />
        }
        else if (value === 'graph') {
            return <LineGraph toCurrency={this.state.toCurrency} fromCurrency={this.state.fromCurrency} />
        }
        else {
            return <Image imageSrc={artWork} imageWidth={'100%'} />
        }
    }

    render() {
        if (this.state.error) {
            return <div>Error</div>
        } else if (!this.state.isLoaded) {
            return <div>Loading...</div>
        }

        else {
            let fromAmount: number, toAmount: number
            if (this.state.amountInFromCurrency) {
                fromAmount = this.state.amount
                toAmount = this.state.amount * this.state.exchangeRate
            }

            else {
                toAmount = this.state.amount
                fromAmount = this.state.amount / this.state.exchangeRate
            }
            return (
                <div style={mainWrapper}>
                    <div style={{ ...wrapper, ...mainGroupItem }}>
                        <div style={groupItem}>
                            <CurrencyRow
                                name={'from'}
                                nameInput={'fromInput'}
                                currencyOptions={(this.state.options)}
                                selectedCurrency={this.state.fromCurrency}
                                onChangeCurrency={(event) => this.changeCurrency(event)}
                                onChangeAmount={(event) => this.changeAmount(event)}
                                amount={fromAmount}
                            />
                            <Flag flagImage={this.state.fromFlag} />
                        </div>
                        <SyncIcon style={{ fontSize: 50 }} onClick={(event: { preventDefault: () => void }) => this.handleClick(event)} />
                        <div style={groupItem}>
                            <CurrencyRow
                                name={'to'}
                                nameInput={'toInput'}
                                currencyOptions={(this.state.options)}
                                selectedCurrency={this.state.toCurrency}
                                onChangeCurrency={(event) => this.changeCurrency(event)}
                                onChangeAmount={(event) => this.changeAmount(event)}
                                amount={toAmount}
                            />
                            <Flag flagImage={this.state.toFlag} />
                        </div>

                    </div>
                    <div style={mainGroupItem}>
                        {this.changeDisplayPage(this.props.displayPage)}
                    </div>
                </div>)
        }
    }
}

const mainWrapper: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '2rem',
    justifyItems: 'space-between',
    alignItems: 'center',
    height: '100vh'
}


const wrapper: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0',
    margin: '10rem 0',
}


const groupItem: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
}

const mainGroupItem: React.CSSProperties = {
    flex: '1 40%',
}

