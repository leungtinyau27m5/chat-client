import { useCallback, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { memberListAtom, memberMetaAtom } from "src/data/member.atom";
import {
  MySocket,
  SocketCodeMap,
  SocketEvents,
} from "src/shared/chatSocket.proto";

const MemberHandler = (props: MemberHandlerProps) => {
  const { wss } = props;
  const [memberList, setMemberList] = useRecoilState(memberListAtom);
  const setMemberMeta = useSetRecoilState(memberMetaAtom);

  const handleMemberList: SocketEvents.ListenEvents["member:list"] =
    useCallback(
      (code, res) => {
        if (res instanceof Error || res === undefined) {
          return;
        }
        const { id, list, meta } = res;
        const newData = { ...memberList };
        const newList = newData[id] ? [...newData[id]] : [];
        const startIdx = newList.length - meta.offset;
        newList.splice(startIdx, 0, ...list);
        const ids = [] as number[];
        const unique = newList.reduce((arr, ele) => {
          if (!ids.includes(ele.id)) {
            arr.push(ele);
            ids.push(ele.id);
          }
          return arr;
        }, [] as typeof newList);
        setMemberList((state) => ({
          ...state,
          [id]: unique,
        }));
        setMemberMeta((state) => ({
          ...state,
          [id]: {
            offset: meta.offset,
            total: meta.total,
            page: Math.ceil(unique.length / 20),
          },
        }));
      },
      [memberList, setMemberList, setMemberMeta]
    );

  useEffect(() => {
    wss.on("member:list", handleMemberList);
    return () => {
      wss.off("member:list", handleMemberList);
    };
  }, [wss, handleMemberList]);

  return <></>;
};

export interface MemberHandlerProps {
  wss: MySocket;
}

export default MemberHandler;
