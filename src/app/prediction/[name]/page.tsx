const getPredictedAge = async (name:string) => {
    const res = await fetch(`https://api.agify.io/?name=${name}`);
    return res.json();
}

const getPredictedNationality = async (name:string) => {
    const res = await fetch(`https://api.nationalize.io/?name=${name}`);
    return res.json();
}

const getPredictedGender = async (name:string) => {
    const res = await fetch(`https://api.genderize.io/?name=${name}`);
    return res.json();
}

interface Params {
    params: { name: string };
}

export default async function Page({ params }: Params) { //server components have to be asynC?
    const ageData = getPredictedAge(params.name);
    const nationalityData = getPredictedNationality(params.name);
    const genderData = getPredictedGender(params.name);

    const [age, nationality, gender] = await Promise.all([
        ageData,
        nationalityData,
        genderData
    ])
    return (
        <div>
            <h1>Peersonal Info</h1>
            <p>Age : {age?.age}</p>
            <p>Nationality : {nationality?.country[0]?.country_id}</p>
            <p>Gender: {gender?.gender}</p>
        </div>
    )
}