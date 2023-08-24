import { createContext, useContext, useState, useEffect } from 'react';
import { v4 } from 'uuid';
import ShortUniqueId from 'short-unique-id';
import { EduJournServices } from './services/EduJournServices';
import { toast } from 'react-toastify';
import { useAppSelector } from './app/store';
import { FieldValue } from 'firebase/firestore';
import { ArticleInfoInt, MailEnum, PageSectEnum } from './types';

// todo DELTE THESE INTERFACES
interface CommentInt {
  senderId: string;
  timestamp: FieldValue;
  msg: string;
  name: string;
  readers: string[];
}

interface allAuthorArticlesInt {
  id: any;
  title: string;
  status: string;
  category: string;
  comments: CommentInt[];
  verUrls: string[];
}

interface ContextInt {
  commentArticleId?: string;
  setCommentArticleId?: React.Dispatch<React.SetStateAction<string>>;
  setStatusArticleId?: React.Dispatch<React.SetStateAction<string>>;
  statusArticleId?: string;
  selectedStatus?: string;
  setSelecetedStatus?: React.Dispatch<React.SetStateAction<string>>;
  versionArticleId?: string;
  setVersionArticleId?: React.Dispatch<React.SetStateAction<string>>;
  reviewersArticleId?: string;
  setReviewersArticleId?: React.Dispatch<React.SetStateAction<string>>;
  verErrorMsg?: string;
  setVerErrorMsg?: React.Dispatch<React.SetStateAction<string>>;
  editorsArticleId?: string;
  setEditorsArticleId?: React.Dispatch<React.SetStateAction<string>>;
  isAddTeam?: boolean;
  setIsAddTeam?: React.Dispatch<React.SetStateAction<boolean>>;
  isSettings?: boolean;
  setIsSettings?: React.Dispatch<React.SetStateAction<boolean>>;
  pageSect?: PageSectEnum;
  setPageSect?: React.Dispatch<React.SetStateAction<PageSectEnum>>;
  getVerificationLink?: () => Promise<void>;
  logOut?: () => Promise<void>;
  disableVerBtn?: boolean;
  setDisableVerBtn?: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggingOut?: boolean;
  setIsLoggingOut?: React.Dispatch<React.SetStateAction<boolean>>;
  justLoggedOut?: boolean;
  setJustLoggedOut?: React.Dispatch<React.SetStateAction<boolean>>;
  superAppLoading?: boolean;
  setAffirm?: React.Dispatch<React.SetStateAction<boolean>>;
  affirm?: boolean;
  setSendMail?: React.Dispatch<
    React.SetStateAction<{
      state: boolean;
      type: MailEnum;
      id?: string;
    }>
  >;
  sendMail?: {
    state: boolean;
    type: MailEnum;
    id?: string;
  };
  verDisplayArticle?: ArticleInfoInt | null;
  setVerDisplayArticle?: React.Dispatch<
    React.SetStateAction<ArticleInfoInt | null>
  >;
  isReload?: boolean;
  setIsReload?: React.Dispatch<React.SetStateAction<boolean>>;
  setConfirmations?: React.Dispatch<
    React.SetStateAction<{
      isShow: boolean;
      msg: string;
    }>
  >;
  confirmations?: {
    isShow: boolean;
    msg: string;
  };
}

// * This enum is for the sections on the dashboard
// * 'all' for 'all articles', 'rev' for articles under rev and 'sub' for articles to be reviewed

const AppContext = createContext<ContextInt>({});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [commentArticleId, setCommentArticleId] = useState('');
  const [statusArticleId, setStatusArticleId] = useState('');
  const [versionArticleId, setVersionArticleId] = useState('');
  const [reviewersArticleId, setReviewersArticleId] = useState('');
  const [editorsArticleId, setEditorsArticleId] = useState('');
  const [isAddTeam, setIsAddTeam] = useState(false);
  const [isSettings, setIsSettings] = useState(false);
  const [disableVerBtn, setDisableVerBtn] = useState(false);
  const [verErrorMsg, setVerErrorMsg] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [justLoggedOut, setJustLoggedOut] = useState(false);
  const [superAppLoading, setSuperAppLoading] = useState(true);
  const [verDisplayArticle, setVerDisplayArticle] =
    useState<ArticleInfoInt | null>(null);

  const [pageSect, setPageSect] = useState<PageSectEnum>(PageSectEnum.all);
  const eduJournServices = new EduJournServices();

  const [selectedStatus, setSelecetedStatus] = useState('pending');
  const { userAppLoading } = useAppSelector((state) => state.user);
  const { articleAppLoading } = useAppSelector((state) => state.article);

  const [isReload, setIsReload] = useState(false);
  const [sendMail, setSendMail] = useState({
    state: false,
    type: MailEnum.appArt,
  });
  const [confirmations, setConfirmations] = useState({
    isShow: false,
    msg: '',
  });
  const [affirm, setAffirm] = useState(false);

  const getVerificationLink = async () => {
    try {
      setDisableVerBtn(true);
      await eduJournServices.emailVer();
      toast.success('Link sent');
    } catch (error) {
      setVerErrorMsg('too many requests');
      console.log(error);
    }
  };

  const logOut = async () => {
    try {
      setIsLoggingOut(true);
      await eduJournServices.logOut();
      setJustLoggedOut(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const sharedProps: ContextInt = {
    commentArticleId,
    setCommentArticleId,
    statusArticleId,
    setStatusArticleId,
    selectedStatus,
    setSelecetedStatus,
    versionArticleId,
    setVersionArticleId,
    reviewersArticleId,
    setReviewersArticleId,
    editorsArticleId,
    setEditorsArticleId,
    pageSect,
    setPageSect,
    isAddTeam,
    setIsAddTeam,
    isSettings,
    setIsSettings,
    getVerificationLink,
    disableVerBtn,
    setDisableVerBtn,
    verErrorMsg,
    logOut,
    isLoggingOut,
    justLoggedOut,
    setJustLoggedOut,
    superAppLoading,
    verDisplayArticle,
    setVerDisplayArticle,
    isReload,
    setIsReload,
    confirmations,
    setConfirmations,
    setAffirm,
    affirm,
    sendMail,
    setSendMail,
  };

  useEffect(() => {
    setSuperAppLoading(userAppLoading || articleAppLoading);
  }, [userAppLoading, articleAppLoading]);

  return (
    <AppContext.Provider value={sharedProps}>{children}</AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};