import {formatDate} from '../../utils/utils'
const DeviceList = (props) => {
  return props.devices.map((item, index) => {
    const {
      _id,
      device,
      os,
      manufacturer,
      lastCheckedOutDate,
      lastCheckedOutBy,
      isCheckedOut,
    } = item; //destructuring
    return (
      <tr key={index}>
        <td>{index}</td>
        <td>{device}</td>
        <td>{os}</td>
        <td>{manufacturer}</td>
        <td>{formatDate(lastCheckedOutDate)}</td>
        <td>{lastCheckedOutBy}</td>
        <td>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              value={isCheckedOut}
              checked={isCheckedOut}
              onChange={(e) => {
                props.handleCheckout(item._id, e.target.checked)
              }}
            />
          </div>
        </td>
        <td>
          <button
            className="btn btn-primary me-2"
            onClick={() => props.handleUpdate(item)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => props.deleteDevice(_id)}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  });
};

export default DeviceList;

