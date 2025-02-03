import React from 'react';
import { useState, useEffect } from "react";

const ProfilePage = ({reg, profile, status}) => {
   
  return (
    <>
    <div className="m-6 flex flex-col shadow-md bg-gray-50 rounded-md items-center bg-white relative">
                <div className="w-full p-2 bg-primary-dark"><label className="block text-2xl font-bold text-white text-center">Profile information</label></div>

               <div className=" m-3" data-collapse="collapse">
                    <table className="min-w-auto bg-white">
                        <tbody>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Registration No.</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{reg.RegID}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Registration Date</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{reg.RegDate}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">College Name</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{profile.CollegeName}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Program Name</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{profile.ProgramName}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Major Name</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{profile.MajorStudy}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Year Level Description</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2" >{profile.YearLevel}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Curriculum Name</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{profile.CurriculumCode}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Max. Load</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{profile.MaxUnitsLoad}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Year of Entry</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{profile.yearOfEntry}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Status</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{profile.isPaying}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Balance</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">Php  {Number(profile.PrevBalance).toLocaleString()+".00"} <span className={`font-bold ${status.allowWithBalance?'':'text-red-600'}`}>{status.allowWithBalance?"(Cleared to enroll)":"(Not clear to enroll)"}</span></td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Gender</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{profile.Gender=='F'? "Female":"Male"}</td>
                            </tr>
                            <tr className="info-cell">
                                <td className="px-3 py-2 font-bold">Scholarship Name</td>
                                <td className="px-3 py-2">:</td>
                                <td className="px-3 py-2">{reg.ScholarProviderName}</td>
                            </tr>
                        </tbody>
                    </table>
                    <h1 className='px-3 py-2 font-bold text-xl'>Overall Progress:</h1>
                    <div className="flex flex-col items-center">
                        <div className="flex justify-between w-full">
                            <div className='font-bold'><p className='text-lg'>{profile.UnitsEarned} <span className='text-xs'>Units Earned</span></p></div>
                            <div className='font-bold'><p className='text-lg'>{profile.CurrTotalCreditUnits} <span className='text-xs'>Total Units</span></p></div>
                        </div>
                        <div className="w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700 mt-2">
                            <div 
                                className="h-6 bg-gradient-to-r from-green-500 to-green-600 text-xl font-medium text-gray-700 text-center p-0.5 leading-none dark:bg-blue-500 rounded-full" 
                                style={{ width: ((profile.UnitsEarned / profile.CurrTotalCreditUnits)*100) + "%" }}
                            >
                                {((profile.UnitsEarned / profile.CurrTotalCreditUnits)*100).toFixed(2)+'%'}
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
    </>
  );
};

export default ProfilePage;