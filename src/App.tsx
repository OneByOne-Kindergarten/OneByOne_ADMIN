import { Admin, Resource, ShowGuesser, EditGuesser } from "react-admin";
import { Dashboard } from "./components/dashboard/Dashboard";
import { UserList } from "./components/users/UserList";
import { UserShowActions } from "./components/users/UserShowActions";
import { InquiryList } from "./components/inquiries/InquiryList";
import { InquiryShowActions } from "./components/inquiries/InquiryActions";
import { CommunityList } from "./components/community/CommunityList";
import { CommunityCreate } from "./components/community/CommunityCreate";
import { CommentList } from "./components/comments/CommentList";
import { KindergartenList } from "./components/kindergartens/KindergartenList";
import { WorkReviewList } from "./components/reviews/WorkReviewList";
import { InternshipReviewList } from "./components/reviews/InternshipReviewList";
import { ReportList } from "./components/reports/ReportList";
import { ReportShowActions } from "./components/reports/ReportActions";
import { NoticeList } from "./components/notices/NoticeList";
import { NoticeCreate } from "./components/notices/NoticeCreate";
import { NoticeEdit } from "./components/notices/NoticeEdit";
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
        name="notices"
        list={NoticeList}
        edit={NoticeEdit}
        create={NoticeCreate}
        icon={() => <span>📢</span>}
        recordRepresentation={(record) => record.title}
        options={{ label: "공지사항 관리" }}
      />
      <Resource
        name="users"
        list={UserList}
        show={(props) => (
          <ShowGuesser {...props} actions={<UserShowActions />} />
        )}
        edit={EditGuesser}
        icon={() => <span>👤</span>}
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
        icon={() => <span>🏫</span>}
        recordRepresentation={(record) => record.name}
        options={{ label: "유치원 관리" }}
      />
      <Resource
        name="work-reviews"
        list={WorkReviewList}
        show={ShowGuesser}
        icon={() => <span>💬</span>}
        recordRepresentation={(record) =>
          `${record.kindergartenName || "유치원"} 근무리뷰`
        }
        options={{ label: "리뷰 관리 - 근무" }}
      />
      <Resource
        name="internship-reviews"
        list={InternshipReviewList}
        show={ShowGuesser}
        icon={() => <span>💬</span>}
        recordRepresentation={(record) =>
          `${record.kindergartenName || "유치원"} 실습리뷰`
        }
        options={{ label: "리뷰 관리 - 실습" }}
      />
      <Resource
        name="community"
        list={CommunityList}
        create={CommunityCreate}
        show={ShowGuesser}
        edit={EditGuesser}
        icon={() => <span>📝</span>}
        recordRepresentation={(record) => record.title}
        options={{ label: "커뮤니티 관리 - 글" }}
      />
      <Resource
        name="comments"
        list={CommentList}
        show={ShowGuesser}
        icon={() => <span>📝</span>}
        recordRepresentation={(record) =>
          `댓글 #${record.commentId || record.id} (게시글 ${
            record.communityId || record.postId
          })`
        }
        options={{ label: "커뮤니티 관리 - 댓글" }}
      />
      <Resource
        name="inquiries"
        list={InquiryList}
        show={(props) => (
          <ShowGuesser {...props} actions={<InquiryShowActions />} />
        )}
        icon={() => <span>❓</span>}
        recordRepresentation={(record) => record.title}
        options={{ label: "문의 관리" }}
      />
      <Resource
        name="reports"
        list={ReportList}
        show={(props) => (
          <ShowGuesser {...props} actions={<ReportShowActions />} />
        )}
        edit={(props) => (
          <ShowGuesser {...props} actions={<ReportShowActions />} />
        )}
        icon={() => <span>🚨</span>}
        recordRepresentation={(record) => `신고 #${record.id}`}
        options={{ label: "신고 관리" }}
      />
    </Admin>
  );
}

export default App;
