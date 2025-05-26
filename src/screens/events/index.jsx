import "./style.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
// import Sidebar from "../../components/Sidebar"; // Importing the Sidebar component instead of FlowNav
import Sidebar2 from "../../components/Sidebar";

export default function Pipeline() {
  const [resp, setResp] = useState();
  const navigate = useNavigate()

  const startFlow = async () => {
    const response2=[
      {    "Investor_name":"3TS Capital Partners"},
      {    "Investor_name":"3VC"},
      {    "Investor_name":"7percent Ventures"},
    ]
    const response1 = [ {
      "Investor_name":"3TS Capital Partners",
      "Website":"https:\/\/3tscapital.com",
      "Country":"Finland",
      "Countries_of_investment":"Finland,Poland,Bulgaria,Luxembourg,Austria,Turkey,Czech Republic,Slovakia,Hungary",
      "Stage_of_investment":"Early Revenue,Scaling,Growth",
      "Investment_thesis":"We invest in exceptional high growth SMEs, which are either proven businesses becoming local leaders or truly innovative global challengers. As a stage-agnostic investor we typically invest in the range of \u20ac300,000 to \u20ac10 million to finance expansion plans, acquisitions and buyouts.\n\n3TS primarily targets investments in the broader TMT sectors including Technology & Internet (Software, Hardware, Mobile, Ecommerce, etc.), Media & Communications (Digital Media, Operators, etc.) and Technology-Enabled Services (Consumer and Business Services, Healthcare Services, etc.).",
      "Investor_type":"VC",
      "Industry":"INFORMATION TECHNOLOGY & SERVICES",
      "Cheque_Size":"$250K - $12M"
  },
  {
      "Investor_name":"3VC",
      "Website":"https:\/\/www.three.vc\/",
      "Country":"Austria",
      "Countries_of_investment":"Austria,Bulgaria,Croatia,Czech Republic,Estonia,Germany,Hungary,Latvia,Lithuania,Poland,Romania,Serbia,Slovakia,Slovenia,Switzerland,Ukraine",
      "Stage_of_investment":"Early Revenue,Scaling",
      "Investment_thesis":"We invest in AI, dev tools, deep tech, security, AR\/VR, data analytics, digital health, app\/mobile, new frontier\n\nWe start to support at Seed stage and invest in Series A, B and beyond.\n\nWe are looking for teams in the GSA & CEE region with the clear intention to make a difference in the world\n\nWe co-invest in syndicates with Tier 1 funds (eg. Forbes\u2019 Midas List) with the ability to proactively support these teams.",
      "Investor_type":"VC",
      "Industry":"HEALTH",
      "Cheque_Size":"$1M - $5M"
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
      "Cheque_Size":"$100K - $2M"
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
      "Cheque_Size":"$100K - $200K"
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
      "Cheque_Size":"$25K - $250K"
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
      "Cheque_Size":"$1M - $5M"
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
      "Cheque_Size":"$100K - $1M"
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
      "Cheque_Size":"$50K - $500K"
  }]
    // const response = await axios
    //   .get(API_KEY + "/auth/founder", {
    //     headers: { token: window.localStorage.getItem("token") },
    //   })
    //   .catch((e) => e.response);
    // const client = response?.data?.msg;
    // const data = {
    //   description: client.description,
    //   company_name: client.companyname,
    //   verticals: client.sectors,
    //   industry: client.industry,
    // };
    // const resp = await axios
    //   .post(
    //     "https://clumsy-zebra-vertx-c9a7a812.koyeb.app/match/founder-to-founder",
    //     data
    //   )
    //   .catch((e) => e.response);
    // console.log(resp.data);
    setResp(response1);
  };

  useEffect(() => {
    startFlow();
    const token = window.localStorage.getItem("token");
    if(!token){
      navigate("/signin")
    }
  }, []);
      

  const response2=[
    {    "Investor_name":"3TS Capital Partners"},
    {    "Investor_name":"3VC"},
    {    "Investor_name":"7percent Ventures"},
  ]


  return (
    <div className="w-full h-screen bg-black flex overflow-hidden">
      <Sidebar2 />
      
      <div className="pipeline flex-1">
        <div className="sections">
          <div className="bx">
            <div className="box mb">Vertx Pipeline</div>
          </div>
          <div className="bx">
            <div className="line"></div>
          </div>
          <div className="cards">
            {/* 1 */}
            <div className="card half st">
              <div className="horline"></div>
              <div className="vertline">
                <div className="line"></div>
              </div>
              <div className="cd">
                <div className="bx">
                  <div className="box">Matched investors</div>
                  <div className="incard">
                    {resp ? (
                      resp?.map((item, i) => (
                        <div className="crd" key={i}>
                          <div className="count">0{i + 1}</div>
                          <div>
                            <p className="title">{item?.Investor_name}</p>
                            <p className="sub">{item?.Investor_type}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="crd load">
                        <div className="count"></div>
                        <div>
                          <p className="title"></p>
                          <p className="sub"></p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2 */}
            <div className="card lft">
              <div className="horline">
                <div className="dot schedule"></div>
                <div className="dot matched"></div>
              </div>
              <div className="vertline">
                <div className="line"></div>
              </div>
              <div className="cd">
                <div className="bx">
                  <div className="box">Emails Scheduled</div>
                  <div className="incard">
                  { response2?.map((item, i) => (
                    <div className="crd" key={i}>
                      <div className="count">
                        <ion-icon
                          name="mail-outline"
                          style={{ fontSize: "15px" }}
                        ></ion-icon>
                      </div>
                      <div>
                  
                        <p className="title">{item?.Investor_name}</p>
                    
                      
                        <p className="sub">09:03pm</p>
                      </div>
                    </div>
                  ))}
                  </div>
                  
                </div>
              </div>
            </div>

            {/* 3 */}
            <div className="card rft">
              <div className="horline">
                <div className="dot replied"></div>
                <div className="dot followed"></div>
              </div>
              <div className="vertline">
                <div className="line"></div>
              </div>
              <div className="cd">
                <div className="bx">
                  <div className="box">Replied Back</div>
                  <div className="incard">
                    <div className="crd">
                      <div className="count">
                        <ion-icon
                          name="mail-outline"
                          style={{ fontSize: "15px" }}
                        ></ion-icon>
                      </div>
                      <div>
                        <p className="title">7percent Ventures</p>
                        <p className="sub">8:00pm</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 */}
            <div className="card half en">
              <div className="horline"></div>
              <div className="vertline">
                <div className="line"></div>
              </div>
            
              <div className="cd">
                <div className="bx">
                  <div className="box">Follow Up</div>
                  <div className="incard">
                  <div className="crd load">
                        <div className="count"></div>
                        <div>
                          <p className="title"></p>
                          <p className="sub"></p>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}