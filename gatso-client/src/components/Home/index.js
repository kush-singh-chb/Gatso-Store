import React from 'react'
import { connect } from 'react-redux'

const Home = ({ user }) => {
    return (
        <div>

        </div>
    )
}

const mapStateToProps = (state) => ({
    user: state.user,
})


export default connect(mapStateToProps, null)(Home)
