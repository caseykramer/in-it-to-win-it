import React from 'react';
import AppHeader from './modules/views/AppHeader'
import AppFooter from './modules/views/AppFooter'
import App from './App'
import withRoot from './modules/withRoot';

function Index() {
    return (
        <React.Fragment>
            <AppHeader />
                <div className="App">
                    <App />
                </div>
            <AppFooter />
        </React.Fragment>
    )
}

export default withRoot(Index)