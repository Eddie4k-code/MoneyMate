export const Account = ({accountName, type}) => {



    return (

        <div className="container">

            <div className="flex-end">
                <div className="text-lg font-medium">Account Name: {accountName}</div>
            </div>
            <div className="text-gray-600">Account Type: {type}</div>
            <button className="delete">Remove</button>
        </div>

        
        )



}