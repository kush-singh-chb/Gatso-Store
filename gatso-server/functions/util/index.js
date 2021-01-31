const validateEircode = (eircode) => {
    var pattern = '(?:^[AC-FHKNPRTV-Y][0-9]{2}|D6W)[ -]?[0-9AC-FHKNPRTV-Y]{4}$';

    var reg = new RegExp(pattern, 'i');
    //return the first Eircode
    return reg.test(eircode)
}

module.exports = {
    validateEircode
}