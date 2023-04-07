#include <windows.h>
#include <cstdio>
#include "resource.h"
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam){
    switch (uMsg)
    {
    case WM_CLOSE:
        DestroyWindow(hwnd);
        break;
    case WM_DESTROY:
        PostQuitMessage(0);
    case WM_DROPFILES: // Handle window resizing
        MessageBox(0,(LPCSTR)"test",(LPCSTR)"file",0);
        break;
    case WM_COMMAND:
        {

            switch(LOWORD(wParam))
            {
                case IDR_MENU1:
                    MessageBox(NULL, "test", "a",MB_ICONEXCLAMATION | MB_OK);
            }
        }
    default:
        return DefWindowProc(hwnd, uMsg, wParam, lParam);
    }
    return 0;
}

int WINAPI WinMain(HINSTANCE inst, HINSTANCE prev_inst, LPSTR cmd_line, int show_cmd)
{
    HMENU hMenu = LoadMenu(inst,MAKEINTRESOURCE(IDR_MENU1));
	const char CLASS_NAME[]  = "mytest";

    WNDCLASS wc = { };
    wc.hCursor       = LoadCursor(NULL, IDC_ARROW);
    wc.lpszMenuName = MAKEINTRESOURCE(IDR_MENU1);
    wc.lpfnWndProc   = WindowProc;
    wc.hInstance     = inst;
    wc.lpszClassName = (LPCSTR)CLASS_NAME;
     if(!RegisterClass(&wc))
    {
        MessageBox(NULL, "Window Registration Failed!", "Error!",
            MB_ICONEXCLAMATION | MB_OK);
        return 0;
    }

    HWND hwnd = CreateWindowEx(
    0x10,                           // Optional window styles.
    CLASS_NAME,                     // Window class
    "Learn to Program Windows",    // Window text
    WS_OVERLAPPEDWINDOW,            // Window style

    // Size and position
    CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT,

    NULL,       // Parent window
    NULL,       // Menu
    inst,  // Instance handle
    NULL        // Additional application data
    );
    if(hwnd == NULL)
    {
        MessageBox(NULL, "Window Creation Failed!", "Error!",MB_ICONEXCLAMATION | MB_OK);
        return 0;
    }
    ShowWindow(hwnd, show_cmd);
    UpdateWindow(hwnd);
    MSG Msg;
        while(GetMessage(&Msg, NULL, 0, 0) > 0)
    {
        TranslateMessage(&Msg);
        DispatchMessage(&Msg);
    }
    return Msg.wParam;
    return 0;

}
