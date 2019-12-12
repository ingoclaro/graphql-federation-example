function App() { }

App.getInitialProps = ({ res }) => {
    if (res) {
        res.writeHead(302, {
            Location: '/api/graphql'
        })
        res.end()
    } else {
        return <div>
            go to <a href='/api/graphql'>graphql UI</a>
        </div>
    }
}

export default App
