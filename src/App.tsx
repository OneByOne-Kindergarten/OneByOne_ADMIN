import { Admin, Resource, ShowGuesser, EditGuesser } from "react-admin";
import { Dashboard } from "./components/dashboard/Dashboard";
import { UserList } from "./components/users/UserList";
import { InquiryList } from "./components/inquiries/InquiryList";
import { CommunityList } from "./components/community/CommunityList";
import { KindergartenList } from "./components/kindergartens/KindergartenList";
import { WorkReviewList } from "./components/reviews/WorkReviewList";
import { InternshipReviewList } from "./components/reviews/InternshipReviewList";
import { dataProvider } from "./providers/dataProvider";
import { authProvider } from "./providers/authProvider";

function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      dashboard={Dashboard}
      title="원바원 관리자"
    >
      <Resource
        name="users"
        list={UserList}
        show={ShowGuesser}
        edit={EditGuesser}
        recordRepresentation={(record) =>
          `${record.nickname} (${record.email})`
        }
        options={{ label: "유저 관리" }}
      />
      <Resource
        name="kindergartens"
        list={KindergartenList}
        show={ShowGuesser}
        edit={EditGuesser}
        recordRepresentation={(record) => record.name}
        options={{ label: "유치원 관리" }}
      />
      <Resource
        name="inquiries"
        list={InquiryList}
        show={ShowGuesser}
        edit={EditGuesser}
        recordRepresentation={(record) => record.title}
        options={{ label: "문의 관리" }}
      />
      <Resource
        name="work-reviews"
        list={WorkReviewList}
        show={ShowGuesser}
        recordRepresentation={(record) =>
          `${record.kindergartenName || "유치원"} 근무리뷰`
        }
        options={{ label: "근무 리뷰 관리" }}
      />
      <Resource
        name="internship-reviews"
        list={InternshipReviewList}
        show={ShowGuesser}
        recordRepresentation={(record) =>
          `${record.kindergartenName || "유치원"} 실습리뷰`
        }
        options={{ label: "실습 리뷰 관리" }}
      />
      <Resource
        name="community"
        list={CommunityList}
        show={ShowGuesser}
        edit={EditGuesser}
        recordRepresentation={(record) => record.title}
        options={{ label: "커뮤니티 관리" }}
      />
    </Admin>
  );
}

export default App;
