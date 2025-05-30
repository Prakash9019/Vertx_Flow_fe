import { useState, useEffect } from "react";
import Button from "../../components/button/component";
import Input from "../../components/input/component";
import axios from "axios";
import API_KEY from "../../../key.js";
import { useNavigate } from "react-router";
import gify from "../gify.gif";
// import Sidebar from "../../components/Sidebar"; 
import Sidebar2 from "../../components/Sidebar.jsx";
import "./style.css";

function Step1({ cb }) {
  return (
    <div className="flex flex-col justify-center items-center gap-2.5 w-full h-full">
      <p className="text-2xl font-bold font-['Kode_Mono']">Founder profile details</p>
      <p className="text-sm text-[#747474] text-center w-1/4 mb-5 md:w-[90%] sm:w-[95%]">
        Sync your profile to auto-fill business details. Complete any missing
        fields manually.
      </p>
      <div className="w-[15%] md:w-max">
        <Button context={"Sync Data"} theme={"light"} callback={() => cb()} />
      </div>
    </div>
  );
}

function Step2({ cb }) {
  const [traction, setTraction] = useState("");
  const [reqFunding, setReq] = useState("");
  const [prevFunding, setPrev] = useState("");
  const countries_list = [
    "Afghanistan","Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo (Congo-Brazzaville)",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czechia (Czech Republic)",
    "Democratic Republic of the Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini (fmr. 'Swaziland')",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Ivory Coast",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar (Burma)",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  const [countries, setCont] = useState([]);

  const [product, setProduct] = useState("");
  const [cofounders, setCofound] = useState("");
  const [contacts, setContact] = useState("");
  const [build, setBuilds] = useState("");
  const [productionStage, setStage] = useState("");
  const [description, setDescription] = useState("");
  const [presense, setPresence] = useState("");
  const [industry, setIndustry] = useState("");
  const [sectors, setSectors] = useState(""); 
  const [company, setCompany] = useState(""); 

  const [focus, setFocus] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const [load, setLoad] = useState(false);

  const preload = async() => {
    const response = await axios.get(API_KEY + "/auth/founder", {headers: {token: window.localStorage.getItem("authToken")}}).catch((e) => e.response);
    console.log(Object.keys(response?.data?.msg || {}));
    if(response?.status === 200){
      setProduct("Vertxai");
      setCofound("Surya,Tharun");
      setContact("team@govertx.com");
      setBuilds("Investor Matchmaking , Pitch Deck Analysis and Generation, Email Outbounding,");
      setStage("Beta - Actively onboarding early-stage startups and investors");
      setDescription("VertexAI is a smart founder's companion – a unified platform that helps early-stage startups validate ideas, build pitch decks, track investor interactions, and connect with relevant VCs. It combines AI matchmaking, fundraising insights, and learning modules into one powerful ecosystem.");
      setPresence("Global");
      setIndustry("Technology, SaaS, EdTech, Fintech, Startup Ecosystem");
      setSectors(["Startup Enablement", "Fundraising", "Venture Capital", "Learning & Development"]);
      setCont(["India", "United States", "Singapore", "United Kingdom", "UAE"]);
      setCompany("VertxLabs Inc");
    } else {
      // Fallback data
      setProduct("Vertxai");
      setCofound("Surya,Tharun");
      setContact("team@govertx.com");
      setBuilds("Investor Matchmaking , Pitch Deck Analysis and Generation, Email Outbounding,");
      setStage("Beta - Actively onboarding early-stage startups and investors");
      setDescription("Vertx is a full-stack fundraising AI platform designed for founders, helping them from idea to investment with AI-powered tools, investor matching, and due diligence automation. It's where bold startups meet smart capital.");
      setPresence("Global");
      setIndustry("Technology, SaaS, EdTech, Fintech, Startup Ecosystem");
      setSectors(["Startup Enablement", "Fundraising", "Venture Capital", "Learning & Development"]);
      setCont(["India", "United States", "Singapore", "United Kingdom", "UAE"]);
      setCompany("VertxLabs Inc");
    }
  };

  useEffect(() => {
    preload();
  }, []);

  useEffect(() => {
    if(description !== "" && sectors !== ""){
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [description, sectors]);

  const startFlow = async () => {
    setLoad(true);
  
    const data = {
      founder_name: "Surya",             // You may want to make this dynamic
      company_name: company,
      what_building: description,           // Map appropriately
      industry: industry,
      sectors: sectors,
      product_stage: productionStage,
      target_countries: countries,
      required_funding: raise,     //2
      co_builder: cofounders,
      best_contact: contacts,
      show_me_what_you_build: build,
      professnal_presence: presense,
      best_description: description,
      current_traction: traction,     //1 
      previous_funding: previousFunding   //3
    };
  
    try {
      const response = await axios.post(
        "https://founder-to-investor-model-427457295403.us-central1.run.app/",
        data
      );
  
      console.log("✅ API Response:", response.data);
  
      // Optional: Handle match_id or matches returned
      // setMatches(response.data.matches);
      // setMatchId(response.data.match_id);
  
      cb(); // proceed to next UI step
    } catch (e) {
      console.error("❌ API Error:", e.response?.data || e.message);
    } finally {
      setLoad(false);
    }
  };
  

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="w-full pt-[4rem] pb-8 px-[15rem] lg:px-[10rem] md:px-6 sm:px-4 flex flex-col gap-5">
        <div className="wrap" onClick={() => setFocus(false)}>
          <label className="capitalize">
            <span className="text-yellow-400">✦</span> What are you building?
          </label>
          <Input
            theme={"dark2 basicDetails"}
            label={"Enter your Product Name"}
            state={product}
            setState={setProduct}
            dis={true}
          />
        </div>
        <div className="w-full h-max flex flex-col gap-2.5" onClick={() => setFocus(false)}>
          <label className="capitalize">
            <span className="text-yellow-400">✦</span> You got co-builders?
          </label>
          <Input
            theme={"dark2 basicDetails"}
            label={"Name them / enter their mails"}
            state={cofounders}
            setState={setCofound}
            dis={true}
          />
        </div>
        <div className="w-full h-max flex flex-col gap-2.5" onClick={() => setFocus(false)}>
          <label className="capitalize">
            <span className="text-yellow-400">✦</span> best contact
          </label>
          <Input
            theme={"dark2 basicDetails"}
            label={"Enter as many as possible"}
            state={contacts}
            setState={setContact}
            dis={true}
          />
        </div>
        <div className="w-full h-max flex flex-col gap-2.5" onClick={() => setFocus(false)}>
          <label className="capitalize">
            <span className="text-yellow-400">✦</span> show what you built?
          </label>
          <Input
            theme={"dark2 basicDetails"}
            label={"Web Url https://workurl.com/"}
            state={build}
            setState={setBuilds}
            dis={true}
          />
        </div>
        <div className="w-full h-max flex flex-col gap-2.5" onClick={() => setFocus(false)}>
          <label className="capitalize">
            <span className="text-yellow-400">✦</span> professional presence?
          </label>
          <Input
            theme={"dark2 basicDetails"}
            label={"Ex: Linkedin"}
            state={presense}
            setState={setPresence}
            dis={true}
          />
        </div>
        <div className="w-full h-max flex flex-col gap-2.5" onClick={() => setFocus(false)}>
          <label className="capitalize">
            <span className="text-yellow-400">✦</span> which industry your product come under?
          </label>
          <Input
            theme={"dark2 basicDetails"}
            label={"Select your industry"}
            state={industry}
            setState={setIndustry}
            dis={true}
          />
        </div>
        <div className="w-full h-max flex flex-col gap-2.5">
          <label className="capitalize">Company Name</label>
          <Input
            theme={"dark2 basicDetails"}
            label={"Enter your company name"}
            state={company}
            setState={setCompany}
            dis={true}
          />
        </div>
        <div className="w-full h-max flex flex-col gap-2.5">
          <label className="capitalize">best description?</label>
          <Input
            theme={"dark2"}
            label={"Enter Description"}
            state={description}
            setState={setDescription}
          />
        </div>
        <div className="w-full h-max flex flex-col gap-2.5" onClick={() => setFocus(false)}>
          <label className="capitalize">sectors?</label>
          <Input
            theme={"dark2"}
            label={"Ex: AI Diagnostics, Machine Learning, Healthcare"}
            state={sectors}
            setState={setSectors}
          />
        </div>
        <div className="w-full h-max flex flex-col gap-2.5">
          <label className="capitalize">Current traction</label>
          <Input
            theme={"dark2"}
            label={"Pre production Launch"}
            state={traction}
            setState={setTraction}
          />
        </div>
        <div className="w-full h-max flex flex-col gap-2.5">
          <label className="capitalize">Required funding</label>
          <Input
            theme={"dark2"}
            label={"<$100K"}
            state={reqFunding}
            setState={setReq}
          />
        </div>
        <div className="w-full h-max flex flex-col gap-2.5">
          <label className="capitalize">Previous funding</label>
          <Input
            theme={"dark2"}
            label={"Angel Investment"}
            state={prevFunding}
            setState={setPrev}
          />
        </div>
        <div className="w-full h-max flex flex-col gap-2.5">
          <label className="capitalize">
            Choose your target countries to secure your investment
          </label>
          <div className="relative">
            <p 
              className="w-full p-3 text-xs rounded-lg font-semibold cursor-pointer bg-[#1a1a1a] border border-[#494949] text-white" 
              onClick={() => setFocus(!focus)}
            >
              {countries?.map((c, i) => (
                <span key={i}>{c}, </span>
              ))}
            </p>
            {focus ? (
              <div className="absolute z-10 w-full max-h-40 overflow-y-auto bg-[#1a1a1a] border border-[#494949] rounded-lg">
                {countries_list?.map((country, i) => (
                  <div className="flex items-center p-2" key={i}>
                    <input
                      type="checkbox"
                      id={country}
                      className="mr-2"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCont([...countries, country]);
                        } else {
                          setCont(countries?.filter((c) => c !== country));
                        }
                      }}
                    />
                    <label htmlFor={country} className="cursor-pointer">
                      {country}
                    </label>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="w-full h-max flex flex-col gap-2.5" onClick={() => setFocus(false)}>
          <label className="capitalize">product stage?</label>
          <Input
            theme={"dark2"}
            label={"Product Stage"}
            state={productionStage}
            setState={setStage}
          />
        </div>
        <div className="w-1/5 md:w-max sm:w-full">
          <Button
            context={load ? <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin" /> : "Proceed"}
            theme={disabled ? "light disabled" : "light"}
            callback={() => {
              disabled ? null : startFlow();
            }}
          />
        </div>
      </div>
    </div>
  );
}


function Step3() {
  const [count, setCount] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState([]);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const response1 =[
    {
        "Investor_name":"3TS Capital Partners",
        "Website":"https:\/\/3tscapital.com",
        "Country":"Finland",
        "Countries_of_investment":"Finland,Poland,Bulgaria,Luxembourg,Austria,Turkey,Czech Republic,Slovakia,Hungary",
        "Stage_of_investment":"Early Revenue,Scaling,Growth",
        "Investment_thesis":"We invest in exceptional high growth SMEs, which are either proven businesses becoming local leaders or truly innovative global challengers. As a stage-agnostic investor we typically invest in the range of \u20ac300,000 to \u20ac10 million to finance expansion plans, acquisitions and buyouts.\n\n3TS primarily targets investments in the broader TMT sectors including Technology & Internet (Software, Hardware, Mobile, Ecommerce, etc.), Media & Communications (Digital Media, Operators, etc.) and Technology-Enabled Services (Consumer and Business Services, Healthcare Services, etc.).",
        "Investor_type":"VC",
        "Industry":"INFORMATION TECHNOLOGY & SERVICES",
        "Cheque_Size":"$250K - $12M",
        "score":"96"
    },{
      "Investor_name":"3VC",
      "Website":"https:\/\/www.three.vc\/",
      "Country":"Austria",
      "Countries_of_investment":"Austria,Bulgaria,Croatia,Czech Republic,Estonia,Germany,Hungary,Latvia,Lithuania,Poland,Romania,Serbia,Slovakia,Slovenia,Switzerland,Ukraine",
      "Stage_of_investment":"Early Revenue,Scaling",
      "Investment_thesis":"We invest in AI, dev tools, deep tech, security, AR\/VR, data analytics, digital health, app\/mobile, new frontier\n\nWe start to support at Seed stage and invest in Series A, B and beyond.\n\nWe are looking for teams in the GSA & CEE region with the clear intention to make a difference in the world\n\nWe co-invest in syndicates with Tier 1 funds (eg. Forbes\u2019 Midas List) with the ability to proactively support these teams.",
      "Investor_type":"VC",
      "Industry":"HEALTH",
      "Cheque_Size":"$1M - $5M",
       "score":"94"
  },
  {
      "Investor_name":"7percent Ventures",
      "Website":"http:\/\/www.7percent.vc",
      "Country":"United Kingdom",
      "Countries_of_investment":"USA,Albania,Andorra,Austria,Belarus,Belgium,Bosnia-H,Bulgaria,Croatia,Cyprus,Czech Republic,Denmark,Estonia,Finland,France,Georgia,Germany,Greece,Holy See,Hungary,Iceland,Ireland,Italy,Latvia,Liechtenstein,Lithuania,Luxembourg,Malta,Moldova,Monaco,Montenegro,Netherlands,North Macedonia,Norway,Poland,Portugal,Romania,San Marino,Serbia,Slovakia,Slovenia,Spain,Sweden,Switzerland,UK,Ukraine",
      "Stage_of_investment":"Prototype,Early Revenue",
      "Investment_thesis":"We invest in frontier (i.e. deeptech) and transformative technologies (fundamentally changing the dynamics of a market, the way the sector works).\nOur sweet spot is first or second money-in, including the conceptual and pre-revenue rounds. We invest between $100k and $2m, depending on stage, with an average first investment of $500k.",
      "Investor_type":"VC",
      "Industry":"VENTURE CAPITAL & PRIVATE EQUITY",
      "Cheque_Size":"$100K - $2M",
       "score":"93"
  },
  {
      "Investor_name":"10K Ventures",
      "Website":"https:\/\/www.10kventures.co\/",
      "Country":"Germany",
      "Countries_of_investment":"Kenya,Nigeria,Brazil,Colombia,Mexico,India,Indonesia,Philippines,Singapore,Vietnam,France,Germany,Spain,UK,Egypt,Israel,UAE",
      "Stage_of_investment":"Idea or Patent,Prototype,Early Revenue",
      "Investment_thesis":"We invest in early stage startups and funds globally\n\nOur (Hypo)thesis here \ud83d\udc49\nhttps:\/\/10kv.notion.site\/The-10KV-Hypo-thesis-c1bf235da3ea426eb79a3a6eabc2b92c",
      "Investor_type":"Family office",
      "Industry":"GENERAL TECH",
      "Cheque_Size":"$100K - $200K",
       "score":"91"
  },
  {
      "Investor_name":"27V (Twenty Seven Ventures)",
      "Website":"https:\/\/twentyseven.ventures\/",
      "Country":"Cayman Islands",
      "Countries_of_investment":"USA,Canada,UK,Hong Kong,Taiwan,New Zealand",
      "Stage_of_investment":"Prototype,Idea or Patent,Early Revenue",
      "Investment_thesis":"We invest in global EdTech and Future of Work startups at the Pre-Seed\/Seed stages. Check size ranging from $25K-$250K, avg is $100K.",
      "Investor_type":"VC",
      "Industry":"GENERAL TECH",
      "Cheque_Size":"$25K - $250K",
       "score":"91"
  },
  {
      "Investor_name":"212",
      "Website":"https:\/\/212.vc\/",
      "Country":"Turkey",
      "Countries_of_investment":"Turkey,Romania,Albania,Azerbaijan,Bosnia-H,Bulgaria,Czech Republic,Lithuania,Serbia,Uzbekistan,UAE,Ukraine,Turkmenistan,Poland,Qatar,Hungary",
      "Stage_of_investment":"Scaling,Growth",
      "Investment_thesis":"We invest in Series A with an average ticket size of \u20ac1-5 million and are looking for B2B tech solutions in the early and growth stage. We invest in all types of software, deep tech, and enterprise hardware.",
      "Investor_type":"VC",
      "Industry":"INFORMATION TECHNOLOGY & SERVICES",
      "Cheque_Size":"$1M - $5M",
       "score":"89"
  },
  {
      "Investor_name":"212Founders",
      "Website":"https:\/\/www.212founders.ma\/",
      "Country":"Morocco",
      "Countries_of_investment":"Morocco",
      "Stage_of_investment":"Idea or Patent,Prototype,Early Revenue",
      "Investment_thesis":"We invest in early-stage Moroccan startups after a 6-month incubation program.",
      "Investor_type":"Incubator, Accelerator",
      "Industry":"GENERAL TECH",
      "Cheque_Size":"$100K - $1M",
       "score":"89"
  },
  {
      "Investor_name":"365.fintech",
      "Website":"https:\/\/www.365fintech.vc\/",
      "Country":"Slovakia",
      "Countries_of_investment":"Slovakia,Czech Republic,Hungary,Poland,Estonia,Latvia,Lithuania,UK,Germany,Belgium,Netherlands,Austria",
      "Stage_of_investment":"Early Revenue,Scaling",
      "Investment_thesis":"We invest in innovative B2B and B2B2C fintech, insurtech and big data startups with a primary geographic focus on CEE, Balkans, Baltics and Europe at large. ",
      "Investor_type":"VC",
      "Industry":"GENERAL TECH",
      "Cheque_Size":"$50K - $500K",
      "score":"88"
  },
  {
      "Investor_name":"574 Invest by SNCF",
      "Website":"https:\/\/574invest.com",
      "Country":"France",
      "Countries_of_investment":"France",
      "Stage_of_investment":"Early Revenue,Scaling",
      "Investment_thesis":"We invest in mobility, industry 4.0 and environmental startups to help SNCF group deliver on its purpose and to boost the growth of the mobility ecosystem, while protecting our planet. ",
      "Investor_type":"Corporate VC",
      "Industry":"TRANSPORTATION & MOBILITY",
      "Cheque_Size":"$500K - $5M", "score":"88"
  },
  {
      "Investor_name":"1337 Ventures",
      "Website":"https:\/\/1337.ventures\/",
      "Country":"Malaysia",
      "Countries_of_investment":"Malaysia,Vietnam,Philippines,Thailand",
      "Stage_of_investment":"Idea or Patent,Prototype,Early Revenue,Scaling",
      "Investment_thesis":"We invest in ideation and early stage startups that are looking to serve ASEAN markets. ",
      "Investor_type":"VC",
      "Industry":"GENERAL TECH",
      "Cheque_Size":"$2K - $50K", "score":"86"
  },
  {
      "Investor_name":"2048 Ventures",
      "Website":"https:\/\/www.2048.vc\/",
      "Country":"United States",
      "Countries_of_investment":"USA,Canada",
      "Stage_of_investment":"Early Revenue,Prototype,Idea or Patent",
      "Investment_thesis":"We invest in pre-seed \/ smaller seed rounds as lead, and write $300-$600K checks. \n \nFirst and foremost, we always want to meet exceptional founders with a compelling vision and strong founder-market-fit, regardless of the industry they are building in.\n \nWe look for companies that are differentiated and defensible through data and technology.\n \nBusiness models we like: API\/Data Platforms, Marketplaces\/Networks, B2B Vertical SaaS, Consumer Subscription with science\/technology edge.\n \nSectors we gravitate towards: Anything API first, bio\/genomics, digital health, frontier tech (preferably software\/enablement layer, but would do hardware too), sustainability, AI\/ML applications, fintech, femtech, eldertech, VR\/AR. ",
      "Investor_type":"VC",
      "Industry":"INFORMATION TECHNOLOGY & SERVICES",
      "Cheque_Size":"$300K - $600K", "score":"85"
  },
  {
      "Investor_name":"Abstraction Capital",
      "Website":"https:\/\/abstraction.vc",
      "Country":"Macao",
      "Countries_of_investment":"USA",
      "Stage_of_investment":"Idea or Patent,Prototype,Early Revenue",
      "Investment_thesis":"We invest in pre-seed and seed rounds for companies building products in the developer tool and cloud infrastructure space.",
      "Investor_type":"VC",
      "Industry":"COMPUTER SOFTWARE",
      "Cheque_Size":"$50K - $400K", "score":"85"
  },
  {
      "Investor_name":"Aescuvest",
      "Website":"https:\/\/www.aescuvest.eu\/",
      "Country":"Germany",
      "Countries_of_investment":"Germany,Israel,Austria,Belgium,Bulgaria,Croatia,Czech Republic,Denmark,Sweden,Finland,France,Greece,Hungary,Ireland,Norway,Spain,Portugal,Ukraine,UK,Switzerland",
      "Stage_of_investment":"Early Revenue",
      "Investment_thesis":"We invest in medical breakthrough innovations in the areas of: digital drug, digital device and digital detection and diagnosis.",
      "Investor_type":"VC",
      "Industry":"HEALTH",
      "Cheque_Size":"$1M - $5M", "score":"85"
  },

    ] 

  const getMatches = async() => {
    // const resp = await axios.get(API_KEY + "/match/matches", {headers: {token: window.localStorage.getItem("authToken")}}).catch(e => e.response);
    // console.log(resp.data);
    // if(resp.status == 200){
    //   setMatches(resp.data.msg);
    // }
    setMatches(response1);
  };

  useEffect(() => {
    getMatches()
  }, [])


  const startPipe = async() => {
    navigate("/flow/outbound")
    // setLoad(true)
    // const resp = await axios.patch(API_KEY + "/match/update", {names: selected}, {headers: {token: window.localStorage.getItem("authToken")}}).catch(e => e.response).finally(() => {
    //   setLoad(false);
    //   if(response.status === 200){
    //     navigate("/flow/outbound")
    //   }
    // });
    // console.log(resp);
  }

  return (
    <div className="feleka">
      <div className="sections">
        <div className="data">
          <p className="title">Mark your preferred investors</p>
          <p className="sub">
            Prioritize those who see potential in you. Rank and select investors
            for targeted email outreach.
          </p>
        </div>
        <div className="valcont">
          <p className="subtitle">Investors Matched</p>
          <p className="count">✦ {count}</p>
        </div>
      </div>
      <div className="table">
        <div className="row headr">
          <p className="head">Name</p>
          <p className="head">Thesis</p>
          <p className="head">Location</p>
          <p className="head">Match Score</p>
          <p className="head"></p>
        </div>
        {matches?.map((match) => (
          <div className="row">
            <td className="data">
              <p className="tit">{match.Investor_name}</p>
              <p className="sub">{match.Investor_type}</p>
            </td>
            <td className="data">{match.Investment_thesis}</td>
            <td className="data">{match.Country}</td>
            <td className="data">
              <div className="tag ok">{match.score}%</div>
            </td>
            <td className="data">
              <input
                type="checkbox"
                className="check"
                onChange={(e) => {
                  if (e.target.checked) {
                    setCount(count + 1);
                    setSelected([...selected, match.company_name]);
                  } else {
                    setSelected(
                      selected.filter((sel) => sel != match.company_name)
                    );
                    if (count <= 0) {
                      setCount(0);
                    } else {
                      setCount(count - 1);
                    }
                  }
                }}
              />
            </td>
          </div>
        ))}
      </div>
      <div className="btnwrap">
        <div className="btnl">
          <Button
            context={load ? <div className="loader"></div> : "Next"}
            theme={"light"}
            callback={() => {
              startPipe();
            }}
          />
        </div>
      </div>
    </div>
  );
}


export default function Matchflow() {
  const [step, setStep] = useState(window.localStorage.getItem("step") || 0);
  const token = window.localStorage.getItem("authToken");
  const navigate = useNavigate();
  
  useEffect(() => {
    if(!token) navigate("/signin");
  }, []);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
        <img src={gify || "/placeholder.svg"} alt="Loading..." className="w-16 h-16 sm:w-20 sm:h-20" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar - Fixed position */}
      <div className="h-screen sticky top-0">
        <Sidebar2 />
      </div>
      
      {/* Main Content - Scrollable */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        <div className="flex-1 flex justify-center items-start text-white overflow-y-auto scrollbar-hide">
          {step === 0 ? (
            <Step1 cb={() => setStep(1)} />
          ) : step === 1 ? (
            <Step2 cb={() => setStep(2)} />
          ) : (
            <Step3 />
          )}
        </div>
      </div>
    </div>
  );
}
