import dummy from '../../static/dummyData';
import colorTheme from '../../colorTheme';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { RiGift2Line, RiPencilLine, RiDeleteBin6Line } from 'react-icons/ri';
import { MdOutlineFlipCameraAndroid } from 'react-icons/md';
import Analysis from '../../components/Analysis';
import Tag from '../../components/Tag';
import Keyword from '../../components/Keyword';
import Searchbar from '../../components/Searchbar';
import TagToggle from '../../components/TagToggle';
import Trash from '../../components/Trash';
import Timer from '../../components/Timer';
import EntireEssay from '../../components/EntireEssay';
import Editor from '../../components/Editor';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Main,
  SideBar,
  TimerWrapper,
  InputWrapper,
  Input,
  ButtonWrapper,
  ButtonWrapper2,
  Button,
  Button2,
  Button3,
  CardContainer,
  Wrapper1,
  Wrapper2,
  Wrapper3,
  ColorPalette,
  Title,
  Content,
  Image,
  IconWrapper,
  IconWrapper2,
  DD,
  Backs,
  Hashtag,
  Icon,
} from './Diary.style';
import axios from 'axios';
const API_HOST = 'http://ec2-3-38-168-114.ap-northeast-2.compute.amazonaws.com';

export default function Diary() {
  //* 자신의 정보 조회하기 (무한 스크롤(에세이리스트), 달력마크/기록분석, 유저정보(닉네임, 사진))
  //* 글 수정하기, 글 삭제하기
  //* 휴지통 영구 삭제하기, 복원하기
  //* 태그 불러오기
  //* 휴지통에 글 불러오기 (조건부로 렌더링하기)
  //* 태그별/검색기능별 필터링하기 (여기는 무한 스크롤X)

  // 유저정보 업데이트

  // 다이어리 전체 리스트
  const [diaryList, setDiaryList] = useState(dummy);

  // 다이어리 deleted 필터링하기 => 굳이? 그냥 mapping 할 때 조건을 걸어줘도 상관 없을 것 같다.
  // const [deletedDiaryList, setDeletedDiaryList] = useState(null);
  // const filtered = diaryList.filter(diary => {
  //   return diary.isPublic === true;
  // });
  // setDeletedDiaryList(filtered);

  // 달력 마크 & 기록 분석
  const [markList, setMarkList] = useState(null);
  const [recordList, setRecordList] = useState(null);

  // 태그
  const defaultTags = ['오늘아침'];
  const [tags, setTags] = useState(defaultTags);

  // 사용자 에세이 인풋
  const [input, setInput] = useState('');
  const handleInput = e => {
    setInput(e.target.value);
    setTimerOn(true);
  };

  // 공개 설정
  const [isPublic, setIsPublic] = useState(false);
  const handlePublic = () => {
    setIsPublic(!isPublic);
  };

  //* 서버에 요청 보내기 (액세스 토큰이 필요하다)
  const handleSubmit = () => {
    if (input !== '') {
      setInput('');
      setTimerOn(false);

      axios
        .post(
          `${API_HOST}/api/v1/essays`,
          {
            content: input,
            tags: [
              { id: 0, tagName: tags[0] },
              { id: 1, tagName: tags[1] },
              { id: 2, tagName: tags[2] },
            ],
            isPublic,
          },
          { headers: { authorization: { 'Content-Type': 'application/json' } } }
        )
        .then(res => {
          if (res.status === 201) {
            // 성공적으로 메세지가 올라가면 다시 메세지를 조회한다. readHandler?
          }
        })
        .catch(error => console.log(err));
      // setDiaryList([{ id: diaryList.length, content: input }, ...diaryList]);
    }
  };

  // 타이머
  const [timerOn, setTimerOn] = useState(false);
  const [minute, setMinute] = useState(1);

  // 키워드 모달
  const [isKeywordModal, setIsKeywordModal] = useState(false);
  const handleKeyword = () => {
    setIsKeywordModal(!isKeywordModal);
  };

  // 휴지통, 태그 드롭다운
  const [isTrashDropdown, setIsTrashDropdown] = useState(false);
  const [isTagsDropdown, setIsTagsDropdown] = useState(false);
  const handleDropdown = () => {
    setIsTrashDropdown(false);
    setIsTagsDropdown(false);
  };

  // 페이지 전환
  const [pageNum, setPageNum] = useState(0);

  // 테마 인덱스
  const [themeIndex, setThemeIndex] = useState(0);
  const handleColorTheme = index => {
    setThemeIndex(index);
  };

  return (
    <>
      <Container color={colorTheme[themeIndex].color}>
        {/* <EntireEssay isPublic={isPublic}></EntireEssay> */}
        {/* <Editor isPublic={isPublic} handlePublic={handlePublic}></Editor> */}
        {isKeywordModal ? (
          <Keyword themeIndex={themeIndex} handleKeyword={handleKeyword} />
        ) : null}
        <Image imgUrl={colorTheme[themeIndex].picture} />
        <SideBar>
          <TimerWrapper>
            <Timer
              minute={minute}
              timerOn={timerOn}
              handleSubmit={handleSubmit}
            />
          </TimerWrapper>
          <InputWrapper onClick={handleDropdown}>
            <ButtonWrapper>
              <div>
                {colorTheme.map((theme, index) => {
                  return (
                    <ColorPalette
                      onClick={() => handleColorTheme(index)}
                      key={index}
                      color={theme.color}
                    />
                  );
                })}
              </div>
              <span onClick={handleKeyword}>
                <RiGift2Line />
              </span>
            </ButtonWrapper>
            <Input value={input} onChange={handleInput} />
            <ButtonWrapper2>
              <Tag tags={tags} setTags={setTags} />
              {isPublic ? (
                <Button2 className="public" onClick={handlePublic}>
                  공개
                </Button2>
              ) : (
                <Button3 className="private" onClick={handlePublic}>
                  공개
                </Button3>
              )}
              <Button onClick={() => setTimerOn(false)}>리셋</Button>
              <Button onClick={handleSubmit}>남기기</Button>
            </ButtonWrapper2>
          </InputWrapper>
          <TagToggle
            isTagsDropdown={isTagsDropdown}
            setIsTagsDropdown={setIsTagsDropdown}
            setIsTrashDropdown={setIsTrashDropdown}
          />
          <Trash
            isTrashDropdown={isTrashDropdown}
            setIsTrashDropdown={setIsTrashDropdown}
            setIsTagsDropdown={setIsTagsDropdown}
          />
          <Searchbar />
        </SideBar>
        {/* 메인 구간 */}
        {pageNum === 0 ? (
          <>
            <Main>
              <Wrapper1>
                {diaryList.map((diary, index) => {
                  return index % 3 === 0 ? (
                    <Card key={index} diary={diary}></Card>
                  ) : null;
                })}
              </Wrapper1>
              <Wrapper2>
                {diaryList.map((diary, index) => {
                  return index % 3 === 1 ? (
                    <Card key={index} diary={diary}></Card>
                  ) : null;
                })}
              </Wrapper2>
              <Wrapper3>
                {diaryList.map((diary, index) => {
                  return index % 3 === 2 ? (
                    <Card key={index} diary={diary}></Card>
                  ) : null;
                })}
              </Wrapper3>
            </Main>
          </>
        ) : (
          <Analysis
            markList={markList}
            recordList={recordList}
            setPageNum={setPageNum}
          />
        )}
        {pageNum === 0 ? (
          <IconWrapper>
            <IoIosArrowForward onClick={() => setPageNum(1)} />
          </IconWrapper>
        ) : (
          <IconWrapper2>
            <IoIosArrowBack onClick={() => setPageNum(0)} />
          </IconWrapper2>
        )}
      </Container>
    </>
  );
}

export const Card = ({ diary }) => {
  const navigator = useNavigate();
  const [hover, setHover] = useState(true);
  const deletehandle = () => {
    // const { id } = diary;
    // axios
    //   .patch(`${API_HOST}/api/v1/userinfo`,
    //     {
    //       id,
    //     },
    //     { headers: { 'Content-Type': 'application/json' } }
    //   )
    //   .then(respond => {
    //     if (
    //       respond.data.message === 'Successfully moved the essay to the trash!'
    //     ) {
    //       navigator('/diary');
    //     } else if (
    //       respond.data.message ===
    //       'Pleases, check your request! Missing or Invalid Operation Parameters'
    //     ) {
    //       alert('삭제 안됨');
    //     }
    //   })
    //   .catch(error => console.log(error));
    navigator('/signin');
  };

  // console.log(tags);
  // const day = new Date();
  // console.log(day);
  // const createdat = day?.slice(0, 10) + ' ' + day?.slice(11, 19);

  const modifiedhandle = () => {};
  return (
    <DD>
      {hover ? (
        <div>
          <CardContainer className="front">
            <Title>{diary.id}번째 글쓰기</Title>
            <Content>{diary.content}</Content>
            <MdOutlineFlipCameraAndroid
              className="md"
              onMouseEnter={() => setHover(false)}
            />
          </CardContainer>
          <Backs className="back" transition="0s" />
        </div>
      ) : (
        <div>
          <CardContainer
            className="front"
            rotate="rotateY(-180deg)"
            position="absolute"
          >
            <Title>{diary.id}번째 글쓰기</Title>
            <Content>{diary.content}</Content>
            <MdOutlineFlipCameraAndroid className="md" />
          </CardContainer>
          <Backs
            className="back"
            rotate="rotateY(0deg)"
            position="static"
            onMouseLeave={() => setHover(true)}
          >
            <span className="createdat">{diary.createdAt}</span>
            <div>
              <div className="tags">
                <Hashtag>#어렵구만</Hashtag>
                <Hashtag>#CSS</Hashtag>
                <Hashtag>#힘들어</Hashtag>
              </div>
              <div className="icons">
                <Icon onClick={modifiedhandle}>
                  <RiPencilLine className="icon" />
                  수정
                </Icon>
                <Icon className="icon2">
                  <RiDeleteBin6Line className="icon" onClick={deletehandle} />
                  삭제
                </Icon>
              </div>
            </div>
          </Backs>
        </div>
      )}
    </DD>
  );
};
