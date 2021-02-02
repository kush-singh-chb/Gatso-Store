import React, { useEffect } from 'react'
import { connect } from 'react-redux'

export const Main = ({ setShowProgess }) => {
    useEffect(() => {

    }, [])
    return (
        <div>
            <p>Vendor Main</p>
        </div>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
