import { Admin, Resource, ShowGuesser, EditGuesser } from "react-admin";
import { dataProvider } from "./providers/dataProvider";
import { authProvider } from "./providers/authProvider";
import { Dashboard } from "./components/dashboard/Dashboard";
import { UserList } from "./components/users/UserList";
import { InquiryList } from "./components/inquiries/InquiryList";
import { CommunityList } from "./components/community/CommunityList";
import { WorkReviewList } from "./components/reviews/WorkReviewList";
import { InternshipReviewList } from "./components/reviews/InternshipReviewList";
import { KindergartenList } from "./components/kindergartens/KindergartenList";

function App() {
  return (
    <Admin
      dataProvider={dataProvider as any}
      authProvider={authProvider}
      dashboard={Dashboard}
      title="OneByOne 관리자"
    >
      <Resource
        name="users"
        list={UserList}
        show={ShowGuesser}
        edit={EditGuesser}
        options={{ label: "사용자 관리" }}
      />

      <Resource
        name="kindergartens"
        list={KindergartenList}
        show={ShowGuesser}
        edit={EditGuesser}
        options={{ label: "유치원 관리" }}
      />

      <Resource
        name="inquiries"
        list={InquiryList}
        show={ShowGuesser}
        edit={EditGuesser}
        options={{ label: "문의 관리" }}
      />
      <Resource
        name="community"
        list={CommunityList}
        show={ShowGuesser}
        edit={EditGuesser}
        options={{ label: "커뮤니티 관리" }}
      />
      <Resource
        name="work_reviews"
        list={WorkReviewList}
        show={ShowGuesser}
        edit={EditGuesser}
        options={{ label: "근무 리뷰 관리" }}
      />
      <Resource
        name="internship_reviews"
        list={InternshipReviewList}
        show={ShowGuesser}
        edit={EditGuesser}
        options={{ label: "실습 리뷰 관리" }}
      />
    </Admin>
  );
}

export default App;
