const company = {
    getCompanyById: (id) => {
        return axios.get(`employers/get-company?id=${id}`);
    },

}
export default company;