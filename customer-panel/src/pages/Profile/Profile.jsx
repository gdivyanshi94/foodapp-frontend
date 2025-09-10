import React, { useEffect, useState } from "react";
import "./Profile.css";
import { getProfile, updateProfile } from "../../services/users";
import { toast } from "react-toastify";

function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [profile, setProfile] = useState(null);

  const loadProfile = async () => {
    const res = await getProfile();
    if (res["status"] == "200") {
      let profile = res["data"]
      setProfile(profile);
      setFirstName(profile['firstName']);
      setLastName(profile['lastName']);
    } else {
      toast.error(res["error"]);
    }
  };

  //useEffect
  useEffect(() => {
    //Profile component got loaded
    loadProfile();
    //Component get unmounted
    return () => {};
  }, []);

  const onProfileUpdate = async () => {
    if (firstName.length == 0) {
      toast.warn("Please enter First Name.");
    } else if (lastName.length == 0) {
      toast.warn("Please enter Last Name.");
    } else {
      const result = await updateProfile(firstName, lastName);
      if (result["status"] == "200") {
        toast.success("Profile Updated Successfully.");
      } else {
        toast.error(result["error"]);
      }
    }
  };

  return (
    <div>
      <h2 className="page-header">Profile</h2>
      {profile && (
        <div>
          <div className='row mb-3'>
            <div className='col'>
              <label htmlFor=''>First Name:</label>
              <input
                onChange={(e) => setFirstName(e.target.value)}
                type='text'
                className='form-control'
                value={firstName}
              />
            </div>
            <div className='col'>
              <label htmlFor=''>Last Name:</label>
              <input
                onChange={(e) => setLastName(e.target.value)}
                type='text'
                className='form-control'
                value={lastName}
              />
            </div>
          </div>

          <div className='row mb-3'>
            <div className='col'>
              <label htmlFor=''>Email:</label>
              <input
                readOnly
                disabled
                type='email'
                className='form-control'
                value={profile['email']}
              />
            </div>
          </div>

          <div className='row'>
            <div className='col'>
              <button
                onClick={onProfileUpdate}
                className='btn btn-success'
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
